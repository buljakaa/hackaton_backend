const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');

router.post('/update-user', userController.updateUser);
router.get('/profile', userController.profile);
module.exports = router;