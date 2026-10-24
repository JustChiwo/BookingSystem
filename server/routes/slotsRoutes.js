const express = require('express');
const { getAvailableSlots } = require('../controllers/slotsController');

const router = express.Router();

router.get('/slots', getAvailableSlots);

module.exports = router;
