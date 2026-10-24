# Sparkle Car Wash: Booking & Reservation System

A full-stack booking system for a car wash and detailing studio. Customers pick a bay, choose a date, see which time slots are free, and book one. They can also cancel bookings. The front end is built with React and Tailwind CSS , and the back end is a REST API built with Node.js and Express.

## Features

- Choose a bay (Wash Bay 1, 2, 3 or the Detailing Bay)
- Pick a date (past dates can't be selected)
- See only the free time slots, shown as clickable buttons
- Book a slot with your name and email
- Double bookings are blocked by the server
- View the bookings for the selected bay and date
- Cancel a booking
- Fully responsive, built mobile first

## Tech Stack

| Part | Technology |
|---|---|
| Front end | React (Vite) |
| Styling | Tailwind CSS v4 |
| Back end | Node.js and Express |
| Data storage | In-memory array (no database) |
| Testing | Postman |

## Project Structure

```
BookingSystem/
├── client/                 React front end
│   └── src/
│       ├── api/            All API calls
│       ├── components/     UI components
│       ├── utils/          Date helpers
│       ├── App.jsx         Holds the shared state
│       └── config.js       API base URL
├── server/                 Express API
│   ├── routes/             URLs only
│   ├── controllers/        Logic for each route
│   ├── data/               Config and bookings array
│   ├── utils/              Slot generation, time and conflict logic
│   ├── app.js              Express setup
│   └── index.js            Starts the server
└── README.md
```

## Getting Started

You need [Node.js 18 or higher](https://nodejs.org/) installed.

### 1. Clone the repo

```
git clone [your-repo-link]
cd BookingSystem
```

### 2. Start the API

```
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Start the front end

Open a **second** terminal:

```
cd client
npm install
npm run dev
```

Open the address Vite prints (usually `http://localhost:5173`).

Both terminals must stay running.

## Car Wash Settings

These live in one file (`server/data/config.js`), so they are easy to change.

| Setting | Value |
|---|---|
| Resources | Wash Bay 1, Wash Bay 2, Wash Bay 3, Detailing Bay |
| Opening hours | 08:00 to 17:00 |
| Slot length | 60 minutes (9 slots per bay per day) |

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Route | Description |
|---|---|---|
| GET | `/resources` | Returns the list of bays |
| GET | `/slots?resource=...&date=YYYY-MM-DD` | Returns the available slots for a bay and date |
| POST | `/bookings` | Creates a booking (with conflict detection) |
| GET | `/bookings/:date/:resource` | Returns all bookings for a date and bay |
| DELETE | `/bookings/:id` | Cancels a booking |

### Create a booking

`POST /api/bookings`

```json
{
  "resource": "Wash Bay 1",
  "date": "2026-10-25",
  "startTime": "09:00",
  "name": "Test User",
  "email": "test@example.com"
}
```

### Status codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Booking created |
| 400 | Validation error (missing field, bad date, bad email, past date, time outside opening hours) |
| 404 | Unknown bay or booking id |
| 409 | That time is already booked |

Every error comes back in the same shape: `{ "error": "message" }`

## How Conflict Detection Works

Each booking is treated as a block of time on a timeline, with the times converted to minutes (09:00 becomes 540). Two bookings overlap when **each one starts before the other one ends**. Because the check uses "less than" and not "less than or equal", back-to-back bookings (09:00 to 10:00, then 10:00 to 11:00) are allowed, but a booking that overlaps an existing one is rejected with a 409.

## Validation

The server checks that:

- all fields are present and the name isn't empty
- the email format is valid
- the bay exists
- the date is a real date in `YYYY-MM-DD` format and isn't in the past
- the start time lines up with a real slot inside opening hours
- the slot isn't already taken

The front end also validates the name and email before sending, and shows the server's error message if something fails.

## Testing

The API was tested in Postman, including the failure cases: double booking, missing fields, an invalid date, a past date, a time outside opening hours, an unknown bay and an unknown booking id.

[Optional: add your Postman and app screenshots here]

## Known Limitations

- **Data is stored in memory.** All bookings are lost when the server restarts. This is intentional, as the brief says no database.
- The reservation list shows bookings for the **selected bay and date** only, because that is what the API supports.
- Earlier times on the current day can still be booked, as the server only checks the date and not the hour.

## Possible Improvements

- Block times that have already passed today
- Different service lengths (quick wash vs full detail)
- Save bookings in a real database
- Customer accounts and email confirmations
