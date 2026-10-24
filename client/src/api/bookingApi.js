import { API_BASE_URL } from '../config';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error('Could not reach the booking server. Please check that it is running and try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }

  return data;
}

export const bookingApi = {
  getResources() {
    return request('/resources');
  },

  getSlots(resource, date) {
    const query = `resource=${encodeURIComponent(resource)}&date=${encodeURIComponent(date)}`;
    return request(`/slots?${query}`);
  },

  getBookings(date, resource) {
    return request(`/bookings/${encodeURIComponent(date)}/${encodeURIComponent(resource)}`);
  },

  createBooking(booking) {
    return request('/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(booking)
    });
  },

  deleteBooking(id) {
    return request(`/bookings/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
};
