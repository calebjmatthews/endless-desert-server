const mysql = require('promise-mysql');

class DataBaseHandler {
  constructor() {
    mysql.createPool({
      host: process.env.DEV_HOST,
      user: process.env.DEV_MYSQL_USER,
      password: process.env.DEV_MYSQL_PASSWORD,
      database: process.env.DEV_MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 0
    }).then((res) => {
      this.pool = res;
    });
  }
}

let dbh = new DataBaseHandler();

module.exports = {dbh};
