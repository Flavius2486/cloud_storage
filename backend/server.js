import express, { query } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import formidable from "formidable";
import fs from "fs";
import path from "path";

import database from "./database/connection.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3001", "https://localhost:3001"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
    origin: true,
    limit: Infinity,
  })
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: Infinity }));
app.use(express.json());
app.use(express.urlencoded({ limit: Infinity, extended: true }));

function getUser(cookies) {
  try {
    const decodedToken = jwt.verify(cookies.jwt, process.env.ACCSESS_TOKEN);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
}

function generateUniqueId() {
  const characters = "1234567890abcdefghijklmnopqrstuvwxyz";
  const filenameLength = 15;

  // Generate a random filename
  let randomFilename = "";
  for (let i = 0; i < filenameLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomFilename += characters.charAt(randomIndex);
  }

  const currentDate = new Date()
    .toISOString()
    .replace(/[-:.]/g, "")
    .replace("T", "")
    .slice(0, 14);

  const uniqueFilename = randomFilename + "_" + currentDate;

  return uniqueFilename;
}

function getFormatedDate(date) {
  const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
  const month =
    date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
  const seconds =
    date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

app.post("/login", (req, res) => {
  const { email_username, password, remember } = req.body;
  if (!password || !email_username) {
    return res.json({
      message: "Please provide username and/or password",
      auth: false,
    });
  } else {
    database.query(
      "SELECT * FROM users WHERE email=? or username=?",
      [email_username, email_username],
      (err, data) => {
        if (err) throw err;
        if (data) {
          bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) throw err;
            if (
              result &&
              (data[0].email === email_username ||
                data[0].username === email_username)
            ) {
              const expiresIn = remember
                ? 7 * 24 * 60 * 60 * 1000
                : (1 / 2) * 60 * 60 * 1000;

              const expirationDate = new Date(Date.now() + expiresIn);
              const accsessToken = jwt.sign(
                {
                  email: data[0].email,
                  username: data[0].username,
                  exp: expirationDate.getTime(),
                },
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

app.get("/verify-auth", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token === null) {
    return res.json({ auth: false, email: null });
  }

  jwt.verify(token, process.env.ACCSESS_TOKEN, (err, email, username) => {
    if (err) {
      return res.json({ auth: false, email: null });
    }
    res.json({ auth: true, email: email, username: username });
  });
});

let filesArray = [];
let prevRelativePath = [];
let foldersArray = [];
let uploadedFoldersArray = [];

function createFolders(i) {
  let relativePathLength =
    filesArray[i].path.length < prevRelativePath.length
      ? filesArray[i].path.length
      : prevRelativePath.length;
  let newRelativePath = false;

  for (let j = 0; j <= relativePathLength; j++) {
    if (
      filesArray[i].path[j] &&
      filesArray[i].path[j] !== prevRelativePath[j]
    ) {
      foldersArray.push({
        name: filesArray[i].path[j],
        uniqueName: generateUniqueId(),
        path: filesArray[i].path
          ? JSON.parse(JSON.stringify(filesArray[i].path))
          : [],
        uniquePath: [],
        nestedPosition: j,
        size: 0,
      });
      newRelativePath = true;
    }
  }
  if (newRelativePath) prevRelativePath = filesArray[i].path;
}

function getFoldersPath() {
  //go torough the folders array
  //using two for loops to check every folder with the others
  for (
    let folderIndex1 = 0;
    folderIndex1 < foldersArray.length;
    folderIndex1++
  ) {
    for (
      let folderIndex2 = 0;
      folderIndex2 < foldersArray.length;
      folderIndex2++
    ) {
      //check if the indexes are not the to prevent checking the same folder with itself
      //check if the nestedPosition on position folderIndex1 is is lower than the path array from position folderIndex2 to prevent getting undefined
      //check if the name of the folder from position folderIndex1 is matching the name from the array path from position folderIndex2 with the element from position folderIndex1 in the first "for"
      if (
        folderIndex1 !== folderIndex2 &&
        foldersArray[folderIndex2].path.length >
          foldersArray[folderIndex1].nestedPosition &&
        foldersArray[folderIndex1].name ===
          foldersArray[folderIndex2].path[
            foldersArray[folderIndex1].nestedPosition
          ]
      ) {
        //add the folder unique name in to the folder to know it s location
        foldersArray[folderIndex2].uniquePath[
          foldersArray[folderIndex1].nestedPosition
        ] = foldersArray[folderIndex1].uniqueName;
      }
    }
  }
}

function setFileUniquePath(i) {
  if (foldersArray.length > 0) {
    //go trough folders array
    for (let k = 0; k < foldersArray.length; k++) {
      let isEqual = true;
      //go trough relative path array
      for (let l = 0; l < filesArray[i].path.length; l++) {
        //check if every folder name matches the other one
        if (filesArray[i].path[l] !== foldersArray[k].path[l]) {
          isEqual = false;
        }
      }
      // check the last folder from the files array path  with the actual folder name
      if (
        filesArray[i].path[filesArray[i].path.length - 1] !==
        foldersArray[k].name
      ) {
        isEqual = false;
      }
      //if the conditions are true add the unique path to the file
      if (
        isEqual &&
        filesArray[i].uniquePath.length === 0 &&
        filesArray[i].uniquePath.length <= foldersArray[k].uniquePath.length
      ) {
        foldersArray[k].size += filesArray[i].size;
        filesArray[i].uniquePath = [...foldersArray[k].uniquePath]; // Make a copy
        filesArray[i].uniquePath.push(foldersArray[k].uniqueName); // Add uniqueName to the copied array
      }
    }
  }
}

function uploadFolders(user) {
  for (let m = 0; m < foldersArray.length; m++) {
    database.query(
      "UPDATE data SET size = ? WHERE user_username = ? AND unique_identifier = ?",
      [foldersArray[m].size, user.username, foldersArray[m].uniqueName]
    );
    let upload = true;
    if (uploadedFoldersArray.length) {
      upload = !uploadedFoldersArray.find(
        (uniqueName) => uniqueName === foldersArray[m].uniqueName
      );
    }
    if (upload) {
      uploadedFoldersArray.push(foldersArray[m].uniqueName);
      // delete the folder name from the path
      let folderCopy = JSON.parse(JSON.stringify(foldersArray[m]));
      folderCopy.path.pop();
      folderCopy.path = folderCopy.path.join("/");
      folderCopy.uniquePath = foldersArray[m].uniquePath.join("/");
      storeData(folderCopy, "folder", user);
    }
  }
}

function storeData(data, type, user) {
  const currentDate = new Date();
  database.query(
    "INSERT INTO data (name, unique_identifier, frontend_path,unique_path, creation_date, last_accessed, size, type,public,starred,user_username) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?)",
    [
      data.name,
      data.uniqueName,
      [data.path],
      [data.uniquePath],
      currentDate,
      currentDate,
      data.size,
      type,
      false,
      false,
      user.username,
    ]
  );
}

function updateFoldersSize(folderUniqueName) {}

app.post("/upload", (req, res) => {
  const form = formidable({
    multiples: true,
    maxFileSize: Infinity,
    maxFiles: Infinity,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return;
    }
    const file = files.file[0];

    //set variable to false to let the program know that a chunk was not added(default)
    let chunkAdded = false;
    //verify if are any chunks in the files array
    if (filesArray.length !== 0) {
      //find the file that match the current resumable unique identifier
      filesArray.forEach((fileData) => {
        if (fileData.uniqueIdentifier[0] === fields.resumableIdentifier[0]) {
          //if it found a match add the resumable chunk in the chunks array on th chunk number position - 1
          fileData.chunks[Number(fields.resumableChunkNumber[0]) - 1] = file;
          //let the program know that it found a match
          chunkAdded = true;
        }
      });
    }
    //if it didn't find a resumabke identifier match or the files array is empty add a new object in the files array with the necessarry data
    if (filesArray.length === 0 || !chunkAdded) {
      //if the file has a relative path adn the relative path array is longer that 1 means the file in in a folder
      let fileRelativePath = fields.resumableRelativePath[0].split("/");
      if (fileRelativePath) {
        //delete the last element(the file name) from the path
        fileRelativePath.pop();
      } else fileRelativePath = [];
      filesArray.push({
        name: fields.resumableFilename[0],
        uniqueName: null,
        uniqueIdentifier: fields.resumableIdentifier[0],
        totalChunks: Number(fields.resumableTotalChunks[0]),
        path: fileRelativePath,
        uniquePath: [],
        size: Number(fields.resumableTotalSize[0]),
        chunks: [],
      });
      //add the cunk
      filesArray[filesArray.length - 1].chunks[
        Number(fields.resumableChunkNumber[0]) - 1
      ] = file;
    }
    //verify if any of the files got all the chunks
    (async () => {
      for (let i = 0; i < filesArray.length; i++) {
        //if the array chunks has the length of the resumabel total chunks add the file in the database and on th disk storage
        if (filesArray[i].totalChunks === filesArray[i].chunks.length) {
          const user = getUser(req.cookies);
          if (filesArray[i].path.length > 0) {
            //get the folders from files relative path
            createFolders(i);
            //remove the last element (the current folder name) from the path array
            getFoldersPath();
            //se file unique path by checnking the folders path with the files path
            setFileUniquePath(i);
            // console.log(foldersArray);
            //reset the variables after uploading all the files

            if (user) {
              uploadFolders(user);
            }
          }

          if (user) {
            let fileId;
            if (filesArray[i].name.match(/\.([^.]+)$/)) {
              fileId =
                generateUniqueId() +
                "." +
                filesArray[i].name.match(/\.([^.]+)$/)[1];
            } else {
              fileId = generateUniqueId();
            }
            filesArray[i].uniqueName = fileId;
            filesArray[i].path = filesArray[i].path.join("/");
            filesArray[i].uniquePath = filesArray[i].uniquePath.join("/");
            storeData(filesArray[i], "file", user);

            filesArray.splice(i, 1);
            i--;
          } else {
            response.error("Unauthorized user");
          }
        }
      }
    })().catch((err) => {
      console.log(err);
    });
    res.send("File uploaded successfully");
  });
});

app.post("/reset-data", (req, res) => {
  foldersArray = [];
  filesArray = [];
  uploadedFoldersArray = [];
  prevRelativePath = [];

  res.json({ message: "The data has been reseted" });
});

app.get("/get-data", (req, res) => {
  const user = getUser(req.cookies);
  if (user) {
    database.query(
      "SELECT * FROM data WHERE user_username=?",
      [user.username],
      (err, result) => {
        if (err) throw err;
        const currentTime = new Date();
        const oneWeekMills = 7 * 24 * 60 * 60 * 1000;

        let starredFiles = [];
        let publicFiles = [];
        let recentFiles = [];
        let deletedFiles = [];
        // let nestedFiles = [];
        let notNestedFiles = [];

        result.forEach((file) => {
          const fileLastAccessed = file.last_accessed;
          file.last_accessed = getFormatedDate(file.last_accessed);
          file.creation_date = getFormatedDate(file.creation_date);
          if (file.deletion_time) {
            file.deletion_date = getFormatedDate(file.deletion_date);
            deletedFiles.push(file);
          } else {
            if (file.starred) {
              starredFiles.push(file);
            }
            if (file.public) {
              publicFiles.push(file);
            }
            if (
              currentTime.getTime() - fileLastAccessed.getTime() >
              oneWeekMills
            ) {
              recentFiles.push(file);
            }
            if (file.frontend_path === "") {
              notNestedFiles.push(file);
            } //else if (file.frontend_path !== "") {
            //   nestedFiles.push(file);
            // }
          }
        });
        res.json({
          notNestedFiles: notNestedFiles,
          // nestedFiles: nestedFiles,
          deletedFiles: deletedFiles,
          recentFiles: recentFiles,
          publicFiles: publicFiles,
          starredFiles: starredFiles,
        });
      }
    );
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// app.get("/upload", (req, res) => {
//   res.json(true);
// });

app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
