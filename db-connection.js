const mariadb = require('mariadb');
/**
 * creating db connection
 */
var pool = mariadb.createConnection({host: process.env.host, user: process.env.user, password: process.env.password})

module.exports.pool = pool;