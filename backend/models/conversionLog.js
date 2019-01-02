const mongoose = require('mongoose');

module.exports = mongoose.model('ConversionLog', new mongoose.Schema({
  fromCurrency: {
    name: String,
    amount: Number
  },
  toCurrency: {
    name: String,
    amount: Number
  },
  conversionRate: Number,
  date: Date
}));
