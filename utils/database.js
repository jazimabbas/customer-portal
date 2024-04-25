const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "cms",
  password: "523221@Ali",
});

function query(queryString, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error establishing database connection:", err);
      callback(err, null);
      return;
    }
    connection.query(queryString, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing database query:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  });
}
module.exports = {
  query,
};
