const mysql = require('promise-mysql');

class DataBaseHandler {
  constructor() {
    mysql.createPool({
      host: (process.env.NODE_ENV == 'production')
          ? process.env.PROD_HOST : process.env.DEV_HOST,
      user: (process.env.NODE_ENV == 'production')
          ? process.env.PROD_MYSQL_USER : process.env.DEV_MYSQL_USER,
      password: (process.env.NODE_ENV == 'production')
          ? process.env.PROD_MYSQL_PASSWORD : process.env.DEV_MYSQL_PASSWORD,
      database: (process.env.NODE_ENV == 'production')
          ? process.env.PROD_MYSQL_DB : process.env.DEV_MYSQL_DB,
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
