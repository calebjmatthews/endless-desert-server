const sessionCheckAndRefresh =
  require('./db/session_check_refresh').sessionCheckAndRefresh;

function authenticateSession(req, res, next) {
  sessionCheckAndRefresh(req.body.sessionId, req.body.userId)
  .then((checkRes) => {
    if (checkRes) {
      if (checkRes.succeeded){
        next();
      }
    }
    else {
      res.send(JSON.stringify(
        { succeeded: false, message: 'Unexpected session check result.' }
      ));
    }
  })
}

module.exports = { authenticateSession };
