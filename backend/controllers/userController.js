const bcrypt = require('bcrypt');
const db = require('../db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Register User and Send Verification Email
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into the database with verification status as 'false'
    const userResult = await db.query(
      `INSERT INTO users (user_id, username, email, hashed_password, is_verified, created_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING user_id, email`,
      [username, email, hashedPassword, false]
    );
    const userId = userResult.rows[0].user_id;

    // Generate a verification token and insert it into verification_tokens table
    const verificationToken = crypto.randomBytes(20).toString('hex');
    await db.query(
      `INSERT INTO verification_tokens (user_id, verification_token, created_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [userId, verificationToken]
    );

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Account Verification',
      text: `Click the following link to verify your account: http://localhost:5000/api/users/verify/${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).send('Error sending email');
      }
      res.status(201).json({ message: 'User registered, verification email sent!' });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Server error');
  }
};

// Verify User
exports.verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    // Find verification token in verification_tokens table
    const tokenResult = await db.query(
      'SELECT user_id FROM verification_tokens WHERE verification_token = $1',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const userId = tokenResult.rows[0].user_id;

    // Update user to set verified status in users table
    await db.query('UPDATE users SET is_verified = true WHERE user_id = $1', [userId]);

    // Delete the used verification token from verification_tokens table
    await db.query('DELETE FROM verification_tokens WHERE verification_token = $1', [token]);

    res.status(200).json({ message: 'User verified, account activated' });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).send('Server error');
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Attempting login for email: ${email}`); // Log the login attempt
  
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found'); // Log if user does not exist
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      console.log('Password does not match'); // Log if password mismatch
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.is_verified) {
      console.log('User not verified'); // Log if user is not verified
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    req.session.user = {
      id: user.user_id,
      username: user.username,
      is_verified: user.is_verified
    };
    
    console.log(`Session created with user ID: ${req.session.user.id}`); // Confirm session creation
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
};


// Logout User
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out');
    }

    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

// Update User Information
exports.updateUserProfile = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, currentPassword, newPassword } = req.body;
  const userId = req.session.user?.id; // Dohvaćanje ID-a korisnika iz sesije

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    // Dohvati korisnika iz baze
    const userResult = await db.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ažuriraj lozinku ako su unesene trenutna i nova lozinka
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.hashed_password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE users SET hashed_password = $1 WHERE user_id = $2", [
        hashedPassword,
        userId,
      ]);
    }

    // Ažuriraj email ako je drugačiji od trenutnog
    if (email && email !== user.email) {
      const emailExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      await db.query("UPDATE users SET email = $1 WHERE user_id = $2", [email, userId]);
    }

    // Ažuriraj ili umetni podatke u user_information
    await db.query(
      `INSERT INTO user_information (user_id, first_name, last_name, phone_number)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id)
       DO UPDATE SET first_name = $2, last_name = $3, phone_number = $4`,
      [userId, firstName, lastName, phoneNumber]
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// U controlleru (userController.js)
exports.getUserProfile = async (req, res) => {
  const userId = req.session.user.id;

  try {
    // Dohvati korisničke podatke
    const userResult = await db.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    const user = userResult.rows[0];

    // Dohvati korisničke informacije
    const userInfoResult = await db.query("SELECT * FROM user_information WHERE user_id = $1", [userId]);
    const userInfo = userInfoResult.rows[0];

    if (!user || !userInfo) {
      return res.status(404).json({ message: "User or user information not found" });
    }

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        is_verified: user.is_verified
      },
      userInfo: {
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        phoneNumber: userInfo.phone_number
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Server error");
  }
};
