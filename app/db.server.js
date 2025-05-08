import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = () => {
  try {
    let data = mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "preordertest",
    });
    console.log("Connecting to MySQL database...");
  } catch (err) {
    console.log("Error in connection", err);
  }
};
