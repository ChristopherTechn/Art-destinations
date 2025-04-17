const express = require('express');
const router = express.Router();
const { getAllFAQs, getFAQsByCategory } = require('../Controllers/Faq');

router.get('/', getAllFAQs);
router.get('/:category', getFAQsByCategory);

module.exports = router;
