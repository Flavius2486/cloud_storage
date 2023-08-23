import mysql from "mysql";

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1309",
  database: "cloud_storage",
});

database.connect((err) => {
  if (err) throw err;
  else console.log("Connected to cloud_storage database");
});

export default database;
