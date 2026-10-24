const express = require('express');
const {
  createBooking,
  deleteBooking,
  getBookingsForDateAndResource
} = require('../controllers/bookingsController');

const router = express.Router();

router.post('/bookings', createBooking);
router.get('/bookings/:date/:resource', getBookingsForDateAndResource);
router.delete('/bookings/:id', deleteBooking);

module.exports = router;
