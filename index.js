const express = require('express');
const app = express();

app.use(express.json({extended: true}));

const mongoose = require('mongoose');

async function start() {
  try {
    await mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useUnifiedTopology: true
    });
  } catch (e) {
    console.log("Error: ", e.message);
    process.exit(1);
  }
}

start();

app.listen(PORT, () => console.log(`PORT: ${PORT}`))