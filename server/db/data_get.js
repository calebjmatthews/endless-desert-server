const dbh = require('../db_handler').dbh;

const TABLE_NAMES = require('../constants').TABLE_NAMES;

function dataGet(userId) {
  let selPromises = [];
  TABLE_NAMES.map((tableName) => {
    selPromises.push(dbh.pool.query({
      sql: ('SELECT `value` FROM `' + tableName + '` WHERE `user_id` = ?'),
      values: [5]
    }));
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
