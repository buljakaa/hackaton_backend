const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');

router.post('/update-one/:type/:value', userController.updateOne);
router.post('/update-many/:type/:value', userController.updateMany);
router.delete('/delete-one/:type/:value', userController.deleteOne);
router.delete('/delete-many/:type/:value', userController.deleteMany);
router.get('/profile', userController.profile);
router.get('/read-one/:type/:value', userController.readOne);
router.get('/read-many/:type/:value', userController.readMany);

module.exports = router;