const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');

// Ne stavalj delete ili update po pozivnoj metodi treba da se zna POST/PATCH/DELETE i fali vam
// post metoda normalna za dodavanje
router.post('/', userController.saveMember);
router.get('/one/:type/:value', userController.readOne);
router.get('/many/:type/:value', userController.readMany);
router.patch('/one/:type/:value', userController.updateOne);
router.patch('/many/:type/:value', userController.updateMany);
router.delete('/one/:type/:value', userController.deleteOne);
router.delete('/many/:type/:value', userController.deleteMany);

router.get('/profile', userController.profile);

module.exports = router;
