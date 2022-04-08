const dbh = require('../db_handler').dbh;

function messagesGet({userId, offset}) {
  return dbh.pool.query({
    sql: ('SELECT `timestamp`, `text`, `type`, `icon` FROM `messages` WHERE `user_id` = ? ORDER BY `timestamp` ASC LIMIT 20 OFFSET ?'),
    values: [userId, offset]
  });
}

function messagesInsert({messages, userId}) {
  if (!messages) { return null; }
  return Promise.all(messages.map((message) => {
    const { timestamp, text, type, icon } = message;
    return dbh.pool.query({
      sql: ('INSERT INTO `messages` (`user_id`, `timestamp`, `text`, `type`, `icon`) VALUES (?, ?, ?, ?, ?)'),
      values: [userId, timestamp, text, type, icon]
    })
  }));
}

module.exports = { messagesGet, messagesInsert };
