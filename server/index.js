const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sparkle Car Wash is running on port ${PORT}`);
});
