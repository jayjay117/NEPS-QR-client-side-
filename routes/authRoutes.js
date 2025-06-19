// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../authContorllers/authController');

// Signup route
router.post('/signup', authController.SignUp);

// Login route
router.post('/login', authController.Login);
// PIN login route
router.post('/pinlogin', authController.PINlogin);
router.post('/userSignup', authController.UserSignup);
router.post('/Userlogin', authController.UserLogin);
router.post('/UPLogin',authController.UserPinLogin)

module.exports = router;
 