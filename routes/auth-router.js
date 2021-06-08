const express = require('express');
const router = express.Router();
const authController = require('../controller/auth-controller');

router.post('/register-user', authController.registerUser);
router.get('/git-id', authController.gitId);
router.post('/register-google', authController.registerGoogle);
router.post('/register-team', authController.registerTeam);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);
router.get('/verify', authController.verify);


module.exports = router;