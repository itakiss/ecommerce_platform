//backend/controllers/contactController.js
const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Nodemailer configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'perfume.store.confirmation.mail@gmail.com', 
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Your message has been sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
};
