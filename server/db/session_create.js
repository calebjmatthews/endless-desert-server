const dbh = require('../db_handler').dbh;
const utils = require('../utils').utils;

// Sessions have 8 days of time in which to be refreshed before expiring
const SESSION_DURATION = 691200000;

function sessionCreate(userId) {
  const id = utils.randHex(16);
  return dbh.pool.query({
    sql: 'INSERT INTO `sessions`(`id`, `user_id`, `expires_at`) VALUES (?, ?, ?)',
    values: [id, userId, (new Date(Date.now()).valueOf() + SESSION_DURATION)]
  })
  .then((createRes) => {
    return { succeeded: true, id: id };
  })
  .catch((err) => {
    return { succeeded: false, message: err }
    console.error(err);
  });
}

module.exports = { sessionCreate };
