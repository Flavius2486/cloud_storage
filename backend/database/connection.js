import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const database = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

database.connect((err) => {
  if (err) throw err;
  else console.log("Connected to cloud_storage database");
});

export default database;
