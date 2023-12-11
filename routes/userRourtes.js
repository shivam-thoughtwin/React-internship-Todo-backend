const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const { verifyToken } = require('../middleware/verifyToken');

router.get('/me', verifyToken, userCtrl.getMe);

module.exports = router;