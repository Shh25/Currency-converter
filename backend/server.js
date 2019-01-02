'use strict'

const express = require('express');
const rp = require('request-promise');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ConversionLog = require('./models/conversionLog');
const Currencies = require('./models/currency');

const app = express();

// configure .env variables
require('dotenv').config()

//DB config
mongoose.Promise = require('bluebird');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds143573.mlab.com:43573/exchange`);

//app confing
app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
app.use(bodyParser.json());
//prevent CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//ROUTES
app.get('/', (req, res) => res.send('Hello'));
app.get('/currencies/', (req, res) => {
  Currencies.find((err, currencies) => {
    if (err) res.send(err)
    else res.json(currencies);
  });
});

app.get('/conversionLogs/', (req, res) => {
  ConversionLog.find((err, conversionLog) => {
    console.log('Limit: ',req.query.limit);
    if (err) res.send(err)
    else res.json(conversionLog);
  }).sort(-1).limit(parseInt(req.query.limit));
});
app.post('/uploads/', (req, res) => {
  let currentDate = new Date().toJSON().split('T')[0];
  let previousDate = new Date();
  previousDate = previousDate.setDate(previousDate.getDate() - 1);
  previousDate = new Date(previousDate).toJSON().split('T')[0];
  let currencyString = `${req.body.fromCurrency}_${req.body.toCurrency}`
  let urlString = `${process.env.EXCHANGE_BASE_URL}${process.env.EXCHANGE_CONVERT_PARAMETER}?q=${currencyString}&compact=ultra&date=${previousDate}&endDate=${currentDate}`;
  console.log('URL: ', urlString);
  let response;
  return rp(urlString)
    .then(function (resp) {
      response = JSON.parse(resp);
      console.log(response);
      let toAmount = req.body.amount * response[currencyString][currentDate];
      const conversionLog = new ConversionLog({
        fromCurrency: {
          name: req.body.fromCurrency,
          amount: req.body.amount
        },
        toCurrency: {
          name: req.body.toCurrency,
          amount: toAmount
        },
        conversionRate: response[currencyString][currentDate],
        date: currentDate
      });
      return conversionLog;
    })
    .then(function(conversionLog) {
      return conversionLog.save(err => {
        if (err) res.send(err.message)
        else res.json({ conversionLog, lastRateChange: response[currencyString][previousDate]});
      })
    })
    .catch(function (err) {
      console.log('ERROR: ', err);
        // Crawling failed...
    });
})


app.listen(app.get('port'), () => console.log('Server listening on port ' + app.get('port') + '.'));
