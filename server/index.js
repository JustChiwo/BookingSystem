const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Car wash is running on port ${PORT}`);
});
