import { useEffect, useState } from 'react';
import { bookingApi } from './api/bookingApi';
import AppHeader from './components/AppHeader';
import BookingDashboard from './components/BookingDashboard';
import BookingForm from './components/BookingForm';
import FeedbackMessage from './components/FeedbackMessage';
import PageFooter from './components/PageFooter';
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

  function handleSelectSlot(slot) {
    setSuccessMessage('');
    setSelectedSlot(slot);
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
        <AppHeader />

        <FeedbackMessage type="error" message={pageError} />
        <FeedbackMessage
          type="success"
          message={successMessage}
          onDismiss={() => setSuccessMessage('')}
        />

        <BookingDashboard
          resources={resources}
          resource={resource}
          date={date}
          slots={slots}
          bookings={bookings}
          resourcesLoading={resourcesLoading}
          availabilityLoading={availabilityLoading}
          error={availabilityError}
          onResourceChange={handleResourceChange}
          onDateChange={handleDateChange}
          onSelectSlot={handleSelectSlot}
          onCancelBooking={handleCancelBooking}
        />

        <PageFooter />
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
