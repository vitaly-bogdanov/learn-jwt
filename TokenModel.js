const { request } = require("express");

const {Schema, model} = require('mongoose');

const schema = new Schema({
  guid: {type: String, required: true, unique: true},
  refresh_token: {type: String, required: true}
});

module.exports = model('token', schema)