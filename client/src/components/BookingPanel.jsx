import AvailabilityView from './AvailabilityView';
import DatePicker from './DatePicker';
import ResourceSelector from './ResourceSelector';

function BookingPanel({
  resources,
  resource,
  date,
  slots,
  resourcesLoading,
  availabilityLoading,
  error,
  onResourceChange,
  onDateChange,
  onSelectSlot
}) {
  return (
    <section className="glass-card booking-panel" aria-labelledby="booking-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Make it sparkle</p>
          <h2 id="booking-heading">Find a time</h2>
        </div>
        <span className="step-badge">01</span>
      </div>

      <div className="filter-grid">
        <ResourceSelector
          resources={resources}
          value={resource}
          loading={resourcesLoading}
          onChange={onResourceChange}
        />
        <DatePicker value={date} onChange={onDateChange} />
      </div>

      {resource ? (
        <AvailabilityView
          slots={slots}
          loading={availabilityLoading}
          error={error}
          onSelectSlot={onSelectSlot}
        />
      ) : !resourcesLoading && !error ? (
        <div className="inline-error" role="status">
          No bays are currently available.
        </div>
      ) : null}
    </section>
  );
}

export default BookingPanel;
