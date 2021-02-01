const bcrypt = require('bcrypt');
const dbh = require('../db_handler').dbh;
const utils = require('../utils').utils;

const sessionCreate = require('./session_create').sessionCreate;

function userLogin(userReq) {
  let user = null;

  return dbh.pool.query({
    sql: 'SELECT * FROM `users` WHERE `email` = ?',
    values: [userReq.email]
  })
  .then((userRes) => {
    if (userRes.length == 0) {
      return { succeeded: false, message: ('No account with this email address '
        + 'was found, please double-check and try again.') };
    }
    user = userRes[0];

    if (bcrypt.compareSync(userReq.password, userRes[0].password)) {
      return sessionCreate(userRes[0].id);
    }
    return { succeeded: false, message: ('The password you entered did not match, '
      + 'please try again.') };
  })
  .then((sessionRes) => {
    if (sessionRes.succeeded == false) {
      return sessionRes;
    }
    return { succeeded: true, message: 'Email and password match, session created',
      user: user, sessionId: sessionRes.id };
  })
}

module.exports = { userLogin };
