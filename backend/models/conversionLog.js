const mongoose = require('mongoose');

module.exports = mongoose.model('ConversionLog', new mongoose.Schema({
  fromCurrency: {
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  toCurrency: {
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  conversionRate: Number,
  date: Date
}));
