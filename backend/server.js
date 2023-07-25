import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import session from "express-session";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import multer from "multer";

import database from "./database/connection.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3001", "https://localhost:3001"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
// Add this before the upload route
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/login", (req, res) => {
  const { email, password, remember } = req.body;
  if (!password || !email) {
    return res.json({
      message: "Please provide username and/or password",
      auth: false,
    });
  } else {
    database.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      (err, data) => {
        if (err) throw err;
        if (data) {
          bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) throw err;
            if (result && data[0].email === email) {
              const expiresIn = remember
                ? 7 * 24 * 60 * 60 * 1000
                : (1 / 2) * 60 * 60 * 1000;

              const expirationDate = new Date(Date.now() + expiresIn);
              const accsessToken = jwt.sign(
                { email: email, exp: expirationDate.getTime() },
                process.env.ACCSESS_TOKEN
              );

              res.cookie("jwt", accsessToken, {
                expires: expirationDate,
              });

              res.json({ accsessToken: accsessToken, auth: true });
            }
          });
        } else {
          return res.json({
            message: "Incorrect email and/or password",
            auth: false,
          });
        }
      }
    );
  }
});

app.get("/login", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token === null) {
    return res.json({ auth: false, email: null });
  }

  jwt.verify(token, process.env.ACCSESS_TOKEN, (err, email) => {
    if (err) {
      return res.json({ auth: false, email: null });
    }
    res.json({ auth: true, email: email });
  });
});

app.post("/upload", (req, res) => {
  // Handle the uploaded files here, e.g., save to the database, etc.
  console.log(req.files);
  upload.array("file")(req, res, (err) => {
    if (err) {
      throw err;
      return res.status(500).json({ error: "Error uploading files" });
    }
    // Handle the uploaded files here, e.g., save to the database, etc.
    return res.json({ message: "Files uploaded successfully" });
  });
  return res.json({ message: "Files uploaded successfully" });
});

app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
