const bookings = require('../data/bookings');
const { RESOURCES } = require('../data/config');
const {
  generateSlots,
  hasBookingConflict,
  isPastDate,
  isValidDate
} = require('../utils/bookingUtils');

function getAvailableSlots(req, res) {
  const { resource, date } = req.query;

  if (typeof resource !== 'string' || !resource.trim()
    || typeof date !== 'string' || !date.trim()) {
    return res.status(400).json({ error: 'Resource and date are required' });
  }

  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Date must be a real date in YYYY-MM-DD format' });
  }

  if (isPastDate(date)) {
    return res.status(400).json({ error: 'Date cannot be in the past' });
  }

  if (!RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const availableSlots = generateSlots().filter(
    (slot) => !hasBookingConflict(
      bookings,
      resource,
      date,
      slot.startTime,
      slot.endTime
    )
  );

  return res.json(availableSlots);
}

module.exports = { getAvailableSlots };
