//backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User registration route
router.post('/register', function (req, res) {
  userController.registerUser(req, res);
});

// User login route
router.post('/login', function (req, res) {
  userController.loginUser(req, res);
});

// User verification route
router.get('/verify/:token', function (req, res) {
  userController.verifyUser(req, res);
});

// userRoutes.js or where you define your routes
router.get('/checkSession', (req, res) => {
    if (req.session.user) {
      res.json({ isLoggedIn: true, user: req.session.user });
    } else {
      res.json({ isLoggedIn: false });
    }
  });
  
// User logout route
router.post('/logout', (req, res) => {
    userController.logoutUser(req, res); // Call the logout user controller function
  });

 router.patch("/myprofile",(req, res) => {
  userController.updateUserProfile(req, res); // Call the logout user controller function
}); 

router.get("/getUserProfile", (req, res) => {
  userController.getUserProfile(req, res); 
});

// Export the router with all routes defined
module.exports = router;
