const dbh = require('../db_handler').dbh;

const TABLE_NAMES = require('../constants').TABLE_NAMES;

function deleteAllForUser(email) {
  return dbh.pool.query({
    sql: ('SELECT `id` FROM `users` WHERE `email` = ?'),
    values: [email]
  })
  .then((selRes) => {
    const user = selRes[0];
    if (user) {
      let delPromises = [
        dbh.pool.query({
          sql: ('DELETE FROM `users` WHERE `id` = ?'),
          values: [user.id]
        })
      ];
      [...TABLE_NAMES, 'sessions'].map((tableName) => {
        delPromises.push(dbh.pool.query({
          sql: ('DELETE FROM `' + tableName + '` WHERE `user_id` = ?'),
          values: [user.id]
        }));
      });
      return Promise.all(delPromises);
    }
    else {
      return { success: false, result: 'No user found.' };
    }
  })
  .then((delRes) => {
    if (delRes.success === false) {
      return delRes;
    }
    else if (delRes.length > 0) {
      return { success: true, result: 'User deleted.' };
    }
    else {
      return { success: false, result: JSON.stringify(delRes) };
    }
  });
}

module.exports = { deleteAllForUser };
