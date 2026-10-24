import { ClockIcon, WarningIcon } from './Icons';

function AvailabilityView({ slots, loading, error, onSelectSlot }) {
  return (
    <section className="availability-section" aria-labelledby="availability-heading">
      <div className="availability-title">
        <div>
          <p className="eyebrow">Pick your perfect time</p>
          <h3 id="availability-heading">Available slots</h3>
        </div>
        <ClockIcon className="section-icon" />
      </div>

      {loading && (
        <div className="loading-state" role="status">
          <span className="loading-spinner" />
          Checking available times...
        </div>
      )}

      {!loading && error && (
        <div className="inline-error" role="alert">
          <WarningIcon />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">
            <ClockIcon />
          </span>
          <p>All clean for today!</p>
          <span>No times left for this bay and date. Try another day.</span>
        </div>
      )}

      {!loading && !error && slots.length > 0 && (
        <div className="slot-grid">
          {slots.map((slot) => (
            <button
              className="slot-button"
              type="button"
              key={slot.startTime}
              onClick={() => onSelectSlot(slot)}
            >
              <span>{slot.startTime}</span>
              <span className="slot-dash">-</span>
              <span>{slot.endTime}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default AvailabilityView;
