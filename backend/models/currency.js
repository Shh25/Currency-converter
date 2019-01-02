const mongoose = require('mongoose');

module.exports = mongoose.model("Currency", new mongoose.Schema({
  name: String,
  symbol: String
}));
