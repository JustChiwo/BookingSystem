const bookings = require('../data/bookings');
const { RESOURCES } = require('../data/config');
const { generateSlots, isValidDate } = require('../utils/bookingUtils');

function getAvailableSlots(req, res) {
  const { resource, date } = req.query;

  if (typeof resource !== 'string' || !resource.trim()
    || typeof date !== 'string' || !date.trim()) {
    return res.status(400).json({ error: 'Resource and date are required' });
  }

  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Date must be a real date in YYYY-MM-DD format' });
  }

  if (!RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const bookedStartTimes = bookings
    .filter((booking) => booking.resource === resource && booking.date === date)
    .map((booking) => booking.startTime);
  const availableSlots = generateSlots().filter(
    (slot) => !bookedStartTimes.includes(slot.startTime)
  );

  return res.json(availableSlots);
}

module.exports = { getAvailableSlots };
