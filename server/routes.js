const express = require('express');
const bodyParser = require('body-parser');

const dataUpsert = require('./db/data_upsert').dataUpsert;

module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:19006");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

  app.get('/api/storage/:user_id', (req, res) => {
    console.log('route hit at /api/storage/:user_id');
  });

  app.post('/api/storage/:user_id', (req, res) => {
    dataUpsert(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  });

  app.all('/*', (req, res) => {
    res.send('This is the Endless Desert server. There\'s nothing to see here.');
  });
}
