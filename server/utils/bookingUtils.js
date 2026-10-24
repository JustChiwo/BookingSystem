const {
  OPENING_TIME,
  CLOSING_TIME,
  SLOT_LENGTH_MINUTES
} = require('../data/config');

function timeToMinutes(time) {
  // Convert clock times to minutes so slot and overlap checks use simple numbers.
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

function isValidDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime())
    && parsedDate.toISOString().slice(0, 10) === date;
}

function isPastDate(date) {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');

  return date < today;
}

function generateSlots() {
  const openingMinutes = timeToMinutes(OPENING_TIME);
  const closingMinutes = timeToMinutes(CLOSING_TIME);
  const slots = [];

  for (
    let startMinutes = openingMinutes;
    startMinutes + SLOT_LENGTH_MINUTES <= closingMinutes;
    startMinutes += SLOT_LENGTH_MINUTES
  ) {
    slots.push({
      startTime: minutesToTime(startMinutes),
      endTime: minutesToTime(startMinutes + SLOT_LENGTH_MINUTES)
    });
  }

  return slots;
}

function findSlot(startTime) {
  return generateSlots().find((slot) => slot.startTime === startTime);
}

function hasBookingConflict(bookings, resource, date, startTime, endTime) {
  const requestedStart = timeToMinutes(startTime);
  const requestedEnd = timeToMinutes(endTime);

  return bookings.some((booking) => {
    if (booking.resource !== resource || booking.date !== date) {
      return false;
    }

    const existingStart = timeToMinutes(booking.startTime);
    const existingEnd = timeToMinutes(booking.endTime);

    // Treat each booking as a time range, so partially overlapping times are caught too.
    return existingStart < requestedEnd && requestedStart < existingEnd;
  });
}

module.exports = {
  findSlot,
  generateSlots,
  hasBookingConflict,
  isPastDate,
  isValidDate,
  minutesToTime,
  timeToMinutes
};
