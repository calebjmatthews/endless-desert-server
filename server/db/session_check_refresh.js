const dbh = require('../db_handler').dbh;
const utils = require('../utils').utils;

// Sessions have 8 days of time in which to be refreshed before expiring
const SESSION_DURATION = 691200000;
// Sessions should refresh if they are within 7 days (of the max 8) of expiring
// This avoids the need to refresh the session on every request
const SESSION_REFRESH = 604800000;

function sessionCheckAndRefresh(id, userId) {
  return dbh.pool.query({
    sql: 'SELECT * FROM `sessions` WHERE `id`=? AND `user_id`=?',
    values: [id, userId]
  })
  .then((checkRes) => {
    if (checkRes.length == 0) {
      return { succeeded: false, message: 'No matching session found, please log in.' };
    }
    if (checkRes[0].expires_at < (new Date(Date.now()).valueOf())) {
      return { succeeded: false, message: ('The existing session has expired, '
        + 'please log in.') };
    }
    if (checkRes[0].expires_at < (new Date(Date.now()).valueOf()) - SESSION_REFRESH) {
      dbh.pool.query({
        sql: 'UPDATE `sessions` SET `expires_at`=? WHERE `id`=?',
        values: [(new Date(Date.now()).valueOf() + SESSION_DURATION), id]
      })
      .catch((err) => { console.error(err); });
    }
    return { succeeded: true, message: 'The session was successfully matched.' };
  })
  .catch((err) => {
    return { succeeded: false, message: err };
    console.error(err);
  })
}

module.exports = { sessionCheckAndRefresh };
