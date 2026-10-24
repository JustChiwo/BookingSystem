import BookingPanel from './BookingPanel';
import ReservationList from './ReservationList';

function BookingDashboard({
  resources,
  resource,
  date,
  slots,
  bookings,
  resourcesLoading,
  availabilityLoading,
  error,
  onResourceChange,
  onDateChange,
  onSelectSlot,
  onCancelBooking
}) {
  return (
    <div className="dashboard-grid">
      <BookingPanel
        resources={resources}
        resource={resource}
        date={date}
        slots={slots}
        resourcesLoading={resourcesLoading}
        availabilityLoading={availabilityLoading}
        error={error}
        onResourceChange={onResourceChange}
        onDateChange={onDateChange}
        onSelectSlot={onSelectSlot}
      />

      {resource && (
        <ReservationList
          bookings={bookings}
          date={date}
          resource={resource}
          loading={availabilityLoading || resourcesLoading}
          error={error}
          onCancelBooking={onCancelBooking}
        />
      )}
    </div>
  );
}

export default BookingDashboard;
