const dbh = require('../db_handler').dbh;
const messagesGet = require('./messages').messagesGet;

const TABLE_NAMES = require('../constants').TABLE_NAMES;

function dataGet(userId) {
  let selPromises = [];
  TABLE_NAMES.map((tableName) => {
    if (tableName === 'messages') {
      selPromises.push(messagesGet({ userId, offset: 0 }));
    }
    else {
      selPromises.push(dbh.pool.query({
        sql: ('SELECT `value` FROM `' + tableName + '` WHERE `user_id` = ?'),
        values: [userId]
      }));
    }
  });
  return Promise.all(selPromises)
  .then((selRes) => {
    let dataMap = {};
    TABLE_NAMES.map((tableName, index) => {
      dataMap[tableName] = selRes[index];
    });
    return dataMap;
  });
}

module.exports = { dataGet };
