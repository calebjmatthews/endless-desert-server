const sessionCheckAndRefresh =
  require('./db/session_check_refresh').sessionCheckAndRefresh;

function authenticateSession(req, res, next) {
  sessionCheckAndRefresh(req.body.sessionId)
  .then((checkRes) => {
    if (checkRes) {
      if (checkRes.succeeded){
        next();
      }
      res.send(JSON.stringify(checkRes));
    }
    res.send(JSON.stringify(
      { succeeded: false, message: 'Unexpected session check result.' }
    ));
  })
}
