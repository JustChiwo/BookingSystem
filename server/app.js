const express = require('express');
const cors = require('cors');
const slotsRoutes = require('./routes/slotsRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const resourcesRoutes = require('./routes/resourcesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', slotsRoutes);
app.use('/api', bookingsRoutes);
app.use('/api', resourcesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600
    ? err.status
    : 500;
  const message = status >= 500
    ? 'Internal server error'
    : typeof err.message === 'string' && err.message
      ? err.message
      : 'Request failed';

  res.status(status).json({ error: message });
});

module.exports = app;
