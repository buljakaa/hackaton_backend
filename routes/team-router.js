const express = require('express');
const router = express.Router();
const teamController = require('../controller/team-controller');

router.delete('/delete-one/:type/:value', teamController.deleteOne);
router.delete('/delete-many/:type/:value', teamController.deleteMany);
router.post('/update-one/:type/:value', teamController.updateOne);
router.post('/update-many/:type/:value', teamController.updateMany);
router.get('/read-one/:type/:value', teamController.readOne);
router.get('/read-many/:type/:value', teamController.readMany);

module.exports = router; 