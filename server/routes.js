const express = require('express');
const bodyParser = require('body-parser');
const dbh = require('./db_handler').dbh;

const tableNames = ['vault', 'research_status', 'rates', 'buildings',
  'research_option_decks', 'timers', 'trading_status'];

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
    let queryPromises = [];
    tableNames.map((tableName) => {
      queryPromises.push(dbh.pool.query({
        sql: ('INSERT INTO `' + tableName + '`(`user_id`, `value`) VALUES (?, ?)'),
        values: [5, JSON.stringify(req.body[tableName])]
      }));
    });
    return Promise.all(queryPromises)
    .then((results) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  });

  app.all('/*', (req, res) => {
    console.log('route hit at /*');
    res.send('This is the Endless Desert server. There\'s nothing to see here.');
  });
}
