const express = require('express');
const bodyParser = require('body-parser');

const authenticateSession = require('./auth_session').authenticateSession;
const dataUpsert = require('./db/data_upsert').dataUpsert;
const dataGet = require('./db/data_get').dataGet;
const userCreate = require('./db/user_create').userCreate;
const userLogin = require('./db/user_login').userLogin;
const sessionCheckAndRefresh =
  require('./db/session_check_refresh').sessionCheckAndRefresh;

module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:19006");
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post('/api/storage_get', authenticateSession, (req, res) => {
    dataGet(req.body.userId)
    .then((dataMap) => {
      res.send(JSON.stringify({data: dataMap}));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  });

  app.post('/api/storage_upsert', authenticateSession, (req, res) => {
    dataUpsert(req.body, req.body.userId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  });

  app.post('/api/signup', (req, res) => {
    userCreate(req.body.userReq)
    .then((usRes) => {
      res.send(JSON.stringify({data: usRes}));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  })

  app.post('/api/login', (req, res) => {
    userLogin(req.body.userReq)
    .then((ulRes) => {
      res.send(JSON.stringify({data: ulRes}));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  })

  app.post('/api/session_check', (req, res) => {
    sessionCheckAndRefresh(req.body.sessionId, req.body.userId)
    .then((ulRes) => {
      res.send(JSON.stringify({data: ulRes}));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  })

  app.all('/*', (req, res) => {
    res.send('This is the Endless Desert server. There\'s nothing to see here.');
  });
}
