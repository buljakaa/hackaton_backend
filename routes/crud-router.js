const express = require('express');
const router = express.Router();
const crudController = require('../controller/crud-controller');

router.post('/update-user', crudController.updateUser);
module.exports = router;