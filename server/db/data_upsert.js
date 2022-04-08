const dbh = require('../db_handler').dbh;
const messagesInsert = require('./messages').messagesInsert;

const TABLE_NAMES = require('../constants').TABLE_NAMES;

function dataUpsert(body, userId) {
  let selPromises = [];
  let existsMap = {};
  TABLE_NAMES.map((tableName) => {
    selPromises.push(dbh.pool.query({
      sql: ('SELECT `id` FROM `' + tableName + '` WHERE `user_id` = ?'),
      values: [userId]
    }));
  })
  return Promise.all(selPromises)
  .then((selRes) => {
    let upsPromises = [];
    selRes.map((oneSelRes, index) => {
      if (oneSelRes.length > 0) {
        existsMap[TABLE_NAMES[index]] = true;
      }
    })
    TABLE_NAMES.map((tableName) => {
      if (tableName === 'messages') {
        upsPromises.push(messagesInsert({ messages: body[tableName], userId }));
      }
      else {
        if (existsMap[tableName]) {
          upsPromises.push(dbh.pool.query({
            sql: ('UPDATE `' + tableName + '` SET `value` = ?, '
              + '`timestamp` = CURRENT_TIMESTAMP() WHERE `user_id`=?'),
            values: [JSON.stringify(body[tableName]), userId]
          }));
        }
        else {
          upsPromises.push(dbh.pool.query({
            sql: ('INSERT INTO `' + tableName + '`(`user_id`, `value`) VALUES (?, ?)'),
            values: [userId, JSON.stringify(body[tableName])]
          }));
        }
      }
    });
    return Promise.all(upsPromises)
    .then((results) => {
      return true;
    })
  })
}

module.exports = { dataUpsert };
