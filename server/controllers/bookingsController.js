const { randomUUID } = require('crypto');
const bookings = require('../data/bookings');
const { RESOURCES, SLOT_LENGTH_MINUTES } = require('../data/config');
const {
  findSlot,
  hasBookingConflict,
  isPastDate,
  isValidDate,
  minutesToTime,
  timeToMinutes
} = require('../utils/bookingUtils');

function createBooking(req, res) {
  const { resource, date, startTime, name, email } = req.body || {};
  const values = [resource, date, startTime, name, email];

  if (values.some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ error: 'Resource, date, startTime, name, and email are required' });
  }

  if (!RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Date must be a real date in YYYY-MM-DD format' });
  }

  if (isPastDate(date)) {
    return res.status(400).json({ error: 'Date cannot be in the past' });
  }

  const normalizedEmail = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Email address is invalid' });
  }

  const slot = findSlot(startTime);
  if (!slot) {
    return res.status(400).json({ error: 'Start time must match an available opening-hour slot' });
  }

  const endTime = minutesToTime(timeToMinutes(startTime) + SLOT_LENGTH_MINUTES);
  if (hasBookingConflict(bookings, resource, date, startTime, endTime)) {
    return res.status(409).json({ error: 'The requested time conflicts with an existing booking' });
  }

  const booking = {
    id: randomUUID(),
    resource,
    date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    name: name.trim(),
    email: normalizedEmail,
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  return res.status(201).json(booking);
}

function getBookingsForDateAndResource(req, res) {
  const { date, resource } = req.params;

  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Date must be a real date in YYYY-MM-DD format' });
  }

  if (!RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const matchingBookings = bookings
    .filter((booking) => booking.date === date && booking.resource === resource)
    .sort((first, second) => first.startTime.localeCompare(second.startTime));

  return res.json(matchingBookings);
}

function deleteBooking(req, res) {
  const bookingIndex = bookings.findIndex((booking) => booking.id === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookings.splice(bookingIndex, 1);
  return res.json({ message: 'Booking deleted successfully' });
}

module.exports = {
  createBooking,
  deleteBooking,
  getBookingsForDateAndResource
};
