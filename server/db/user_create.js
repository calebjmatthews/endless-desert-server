const bcrypt = require('bcrypt');
const dbh = require('../db_handler').dbh;
const utils = require('../utils').utils;

function userCreate(userReq) {
  let userId = '';
  if (!userReq.email) {
    return new Promise((resolve) => {
      resolve({ succeeded: false, message: 'Please enter an email address.' });
    });
  }
  if (!userReq.password) {
    return new Promise((resolve) => {
      return { succeeded: false, message: 'Please enter a password.' };
    });
  }
  if (userReq.password.length < 8) {
    return new Promise((resolve) => {
      return { succeeded: false, message: ('Please enter a password eight characters '
        + 'or longer.') };
    });
  }
  return dbh.pool.query({
    sql: 'SELECT `id` FROM `users` WHERE `email` = ?',
    values: [userReq.email]
  })
  .then((firstRes) => {
    if (firstRes.succeeded == false) { return firstRes; }
    if (firstRes.length > 0) {
      return { succeeded: false, message: ('An account using this email address '
        + 'already exists, please log in instead.') };
    }
    userId = utils.randHex(8);
    const passwordHashed = bcrypt.hashSync(userReq.password, bcrypt.genSaltSync(8), null);
    return dbh.pool.query({
      sql: 'INSERT INTO `users`(`id`, `email`, `password`) VALUES (?, ?, ?)',
      values: [userId, userReq.email, passwordHashed]
    })
  })
  .then((secondRes) => {
    if (secondRes.succeeded == false) { return secondRes; }
    return { succeeded: true, userId: userId, message: ('New account successfully '
      + 'created.') };
  })
  .catch((err) => {
    return { succeeded: false, message: err };
  });
}

module.exports = { userCreate };
