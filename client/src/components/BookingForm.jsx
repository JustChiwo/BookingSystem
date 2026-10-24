import { useEffect, useState } from 'react';
import { formatDate } from '../utils/date';
import { CalendarIcon, CloseIcon, ClockIcon, EmailIcon, UserIcon, WarningIcon } from './Icons';

function BookingForm({ resource, date, slot, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, submitting]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName) {
      setFormError('Please enter your name to continue.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ name: cleanName, email: cleanEmail });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">One last step</p>
            <h2 id="booking-modal-title">Your booking</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close booking form"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="booking-summary">
          <div>
            <span className="summary-label">Bay</span>
            <strong>{resource}</strong>
          </div>
          <div className="summary-row">
            <span><CalendarIcon /> {formatDate(date)}</span>
            <span><ClockIcon /> {slot.startTime} - {slot.endTime}</span>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label className="field-label" htmlFor="customer-name">
              <UserIcon />
              Your name
            </label>
            <input
              className="form-control"
              id="customer-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Sam Parker"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="customer-email">
              <EmailIcon />
              Email address
            </label>
            <input
              className="form-control"
              id="customer-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {formError && (
            <div className="inline-error" role="alert">
              <WarningIcon />
              <span>{formError}</span>
            </div>
          )}

          <button className="primary-button submit-button" type="submit" disabled={submitting}>
            {submitting ? 'Booking your wash...' : 'Confirm booking'}
          </button>
          <p className="form-footnote">Your details are only used to manage this reservation.</p>
        </form>
      </section>
    </div>
  );
}

export default BookingForm;
