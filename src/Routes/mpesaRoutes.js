// routes/mpesaRoutes.js
const express = require('express');
const router = express.Router();
const { stkPush } = require('../Controllers/mpesaController');

router.post('/stkpush', stkPush);

module.exports = router;
