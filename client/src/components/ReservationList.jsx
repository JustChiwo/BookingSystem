import { useState } from 'react';
import { formatDate } from '../utils/date';
import { CalendarIcon, ClockIcon, EmailIcon, TrashIcon, UserIcon, WarningIcon } from './Icons';

function ReservationList({ bookings, date, resource, loading, error, onCancelBooking }) {
  const [cancellingId, setCancellingId] = useState('');
  const [cancelError, setCancelError] = useState('');

  async function handleCancel(booking) {
    const confirmed = window.confirm(
      `Cancel the ${booking.startTime} booking for ${booking.name}?`
    );
    if (!confirmed) {
      return;
    }

    setCancelError('');
    setCancellingId(booking.id);
    try {
      await onCancelBooking(booking.id);
    } catch (requestError) {
      setCancelError(requestError.message);
    } finally {
      setCancellingId('');
    }
  }

  return (
    <section className="glass-card reservation-panel" aria-labelledby="reservations-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your day at a glance</p>
          <h2 id="reservations-heading">Reservations</h2>
        </div>
        <span className="reservation-count">{bookings.length}</span>
      </div>

      {resource && date && (
        <div className="reservation-filter">
          <span><CalendarIcon /> {formatDate(date)}</span>
          <strong>{resource}</strong>
        </div>
      )}

      {cancelError && (
        <div className="inline-error reservation-error" role="alert">
          <WarningIcon />
          <span>{cancelError}</span>
        </div>
      )}

      {loading && (
        <div className="loading-state compact-loading" role="status">
          <span className="loading-spinner" />
          Loading reservations...
        </div>
      )}

      {!loading && error && (
        <div className="inline-error reservation-error" role="alert">
          <WarningIcon />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state reservation-empty">
          <span className="empty-state-icon"><CalendarIcon /></span>
          <p>No reservations yet</p>
          <span>Bookings for this bay and date will appear here.</span>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <ul className="reservation-list">
          {bookings.map((booking) => (
            <li className="reservation-item" key={booking.id}>
              <div className="reservation-time">
                <ClockIcon />
                <span>{booking.startTime} - {booking.endTime}</span>
              </div>
              <div className="reservation-details">
                <span><UserIcon /> {booking.name}</span>
                <span><EmailIcon /> {booking.email}</span>
              </div>
              <button
                className="cancel-button"
                type="button"
                onClick={() => handleCancel(booking)}
                disabled={cancellingId === booking.id}
                aria-label={`Cancel booking for ${booking.name} at ${booking.startTime}`}
              >
                <TrashIcon />
                <span>{cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ReservationList;
