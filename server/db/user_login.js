const bcrypt = require('bcrypt');
const dbh = require('../db_handler').dbh;
const utils = require('../utils').utils;

function userLogin(userReq) {
  return dbh.pool.query({
    sql: 'SELECT * FROM `users` WHERE `email` = ?',
    values: [userReq.email]
  })
  .then((userRes) => {
    if (userRes.length == 0) {
      return { succeeded: false, message: ('No account with this email address '
        + 'was found, please double-check and try again.') };
    }

    if (bcrypt.compareSync(userReq.password, userRes[0].password)) {
      console.log('inside successful password match.');
      return { succeeded: true, message: 'Email and password match',
        user: userRes[0] };
    }
    return { succeeded: false, message: ('The password you entered did not match, '
      + 'please try again.') };
  })
}

module.exports = { userLogin };
