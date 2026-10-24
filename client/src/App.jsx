import { useEffect, useState } from 'react';
import { bookingApi } from './api/bookingApi';
import AvailabilityView from './components/AvailabilityView';
import BookingForm from './components/BookingForm';
import DatePicker from './components/DatePicker';
import { CheckIcon, WaterDropIcon } from './components/Icons';
import ReservationList from './components/ReservationList';
import ResourceSelector from './components/ResourceSelector';
import { getLocalDateString } from './utils/date';

function App() {
  const [resources, setResources] = useState([]);
  const [resource, setResource] = useState('');
  const [date, setDate] = useState(getLocalDateString);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Load the available bays once; the first returned bay becomes the initial selection.
  useEffect(() => {
    let ignoreResponse = false;

    async function loadResources() {
      setResourcesLoading(true);
      setPageError('');

      try {
        const loadedResources = await bookingApi.getResources();
        if (ignoreResponse) {
          return;
        }

        setResources(loadedResources);
        setResource(loadedResources[0] || '');
      } catch (error) {
        if (!ignoreResponse) {
          setPageError(error.message);
        }
      } finally {
        if (!ignoreResponse) {
          setResourcesLoading(false);
        }
      }
    }

    loadResources();

    return () => {
      ignoreResponse = true;
    };
  }, []);

  // Reload both lists when the selected bay, date, or a successful change updates.
  useEffect(() => {
    if (!resource || !date) {
      return undefined;
    }

    let ignoreResponse = false;

    async function loadSelectedDay() {
      setAvailabilityLoading(true);
      setAvailabilityError('');

      try {
        const [loadedSlots, loadedBookings] = await Promise.all([
          bookingApi.getSlots(resource, date),
          bookingApi.getBookings(date, resource)
        ]);

        // Ignore results from an earlier selection if the user has changed bay or date.
        if (!ignoreResponse) {
          setSlots(loadedSlots);
          setBookings(loadedBookings);
        }
      } catch (error) {
        if (!ignoreResponse) {
          setAvailabilityError(error.message);
          setSlots([]);
          setBookings([]);
        }
      } finally {
        if (!ignoreResponse) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadSelectedDay();

    return () => {
      ignoreResponse = true;
    };
  }, [resource, date, refreshKey]);

  function handleDateChange(nextDate) {
    setDate(nextDate);
    setSuccessMessage('');
  }

  function handleResourceChange(nextResource) {
    setResource(nextResource);
    setSuccessMessage('');
  }

  async function handleBookingSubmit(details) {
    await bookingApi.createBooking({
      resource,
      date,
      startTime: selectedSlot.startTime,
      ...details
    });

    setSelectedSlot(null);
    setSuccessMessage('Your car wash booking is confirmed. See you soon!');
    setRefreshKey((currentKey) => currentKey + 1);
  }

  async function handleCancelBooking(id) {
    await bookingApi.deleteBooking(id);
    setSuccessMessage('The booking has been cancelled.');
    setRefreshKey((currentKey) => currentKey + 1);
  }

  return (
    <main className="page-shell">
      <div className="app-container">
        <header className="site-header">
          <div className="brand-mark" aria-hidden="true">
            <WaterDropIcon />
          </div>
          <div>
            <p className="eyebrow">A little shine goes a long way</p>
            <h1>Sparkle Car Wash</h1>
            <p className="header-description">
              Book a wash or detailing appointment in just a few clicks.
            </p>
          </div>
        </header>

        {pageError && (
          <div className="notice notice-error" role="alert">
            {pageError}
          </div>
        )}

        {successMessage && (
          <div className="notice notice-success" role="status">
            <CheckIcon />
            <span>{successMessage}</span>
            <button
              className="notice-dismiss"
              type="button"
              onClick={() => setSuccessMessage('')}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        <div className="dashboard-grid">
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
                onChange={handleResourceChange}
              />
              <DatePicker value={date} onChange={handleDateChange} />
            </div>

            {resource ? (
              <AvailabilityView
                slots={slots}
                loading={availabilityLoading}
                error={availabilityError}
                onSelectSlot={(slot) => {
                  setSuccessMessage('');
                  setSelectedSlot(slot);
                }}
              />
            ) : !resourcesLoading && !pageError ? (
              <div className="inline-error" role="status">
                No bays are currently available.
              </div>
            ) : null}
          </section>

          {resource && (
            <ReservationList
              bookings={bookings}
              date={date}
              resource={resource}
              loading={availabilityLoading || resourcesLoading}
              error={availabilityError}
              onCancelBooking={handleCancelBooking}
            />
          )}
        </div>

        <footer className="site-footer">
          <span>Fresh, clean, and ready to roll.</span>
          <span>Choose a bay, pick a time, leave the shine to us.</span>
        </footer>
      </div>

      {selectedSlot && (
        <BookingForm
          resource={resource}
          date={date}
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </main>
  );
}

export default App;
