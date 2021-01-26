const bcrypt = require('bcrypt');
const dbh = require('../db_handler').dbh;
const utils = require('../utils').utils;

function userCreate(userReq) {
  if (!userReq.email) {
    return { succeeded: false, message: 'email missing' };
  }
  if (!userReq.password) {
    return { succeeded: false, message: 'password missing' };
  }
  if (userReq.password.length < 8) {
    return { succeeded: false, message: 'password too short' };
  }
  const userId = utils.randHex(8);
  const passwordHashed = bcrypt.hashSync(userReq.password, bcrypt.genSaltSync(8), null);
  return dbh.pool.query({
    sql: ('INSERT INTO `users`(`id`, `email`, `password`) VALUES (?, ?, ?)'),
    values: [userId, userReq.email, passwordHashed]
  })
  .then((res) => {
    return { succeeded: true, userId: userId, message: 'user inserted' };
  })
  .catch((err) => {
    return { succeeded: false, message: err };
  });
}
