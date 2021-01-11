const express = require('express');
const {
  server_port,
  db_host,
  db_port,
  db_name,
  db_password,
  db_username
} = require('./config')


const app = express();

app.use(express.json({extended: true}));

app.use(require('./router'));

const mongoose = require('mongoose');

async function start() {
  try {
    await mongoose.connect(`mongodb://${db_username}:${db_password}@${db_host}:${db_port}/${db_name}`, {
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

app.listen(server_port, () => console.log(`PORT: ${server_port}`))