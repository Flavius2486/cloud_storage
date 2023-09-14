import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import multer from "multer";
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

/*---------------------------------------------------------*\
                 General functions
/*---------------------------------------------------------*/

function getUser(cookies) {
  try {
    const decodedToken = jwt.verify(
      cookies.accessToken,
      process.env.ACCESS_TOKEN
    );
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
}

function generateUniqueId() {
  const characters =
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ";
  const filenameLength = 8;

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

function storeData(data, type) {
  const currentDate = new Date();
  if (data) {
    database.query(
      "INSERT INTO data (name, unique_identifier, frontend_path, unique_path, creation_date, last_accessed, size, type, public, starred, user_username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.uniqueName,
        data.path, // Remove square brackets
        data.uniquePath, // Remove square brackets
        currentDate,
        currentDate,
        data.size,
        type,
        data.public,
        false,
        data.user,
      ],
      (error, results) => {
        if (error) {
          // Handle the error here
          console.error("Error inserting data:", error);
        }
      }
    );
  }
}

/*---------------------------------------------------------*\
                  Authentication system
/*---------------------------------------------------------*/

function searchRefreshToken(token) {
  return new Promise((resolve, reject) => {
    database.query("SELECT token FROM refresh_tokens", (err, tokens) => {
      if (err) {
        reject(err);
        return;
      }

      const refreshTokenExists = tokens.some(
        (tokenObj) => tokenObj.token === token
      );

      resolve(refreshTokenExists);
    });
  });
}

app.post("/refresh-token", (req, res) => {
  const { refreshToken, accessToken } = req.body;
  //check if the tokens exist
  if (refreshToken === null || accessToken === null) {
    if (refreshToken !== null) {
      database.query(
        "DELETE FROM refresh_tokens WHERE token=?",
        [refreshToken],
        (err) => {
          if (err) throw err;
          //clear the cookies
          res.clearCookie("refreshToken");
          res.json({ auth: false });
        }
      );
    }
  } else {
    //select all tokens
    database.query("SELECT token FROM refresh_tokens", (err, tokens) => {
      if (err) throw err;
      //search the token
      searchRefreshToken(refreshToken).then((exists) => {
        if (exists) {
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) {
              return res.json({ auth: false });
            } else {
              jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err) => {
                if (err) return res.json({ auth: false });
                else {
                  const accessToken = generateAccessToken({
                    username: user.username,
                    email: user.email,
                  });

                  res.cookie("accessToken", accessToken, {
                    expires: new Date(Date.now() + 1000 * 60 * 32),
                  });

                  res.json({ auth: true });
                }
              });
            }
          });
        }
      });
    });
  }
});

app.post("/logout", (req, res) => {
  const { token } = req.body;
  //see if the token exists
  searchRefreshToken(token)
    .then((exists) => {
      if (exists) {
        //delete it from the database
        database.query(
          "DELETE FROM refresh_tokens WHERE token=?",
          [token],
          (err) => {
            if (err) throw err;
            //clear the cookies
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            res.json({ logout: true });
          }
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/login", (req, res) => {
  const { email_username, password } = req.body;
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
        if (data.length) {
          bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) throw err;
            if (
              result &&
              (data[0].email === email_username ||
                data[0].username === email_username)
            ) {
              const user = {
                email: data[0].email,
                username: data[0].username,
              };

              const accessToken = generateAccessToken(user);

              const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
              database.query(
                "INSERT INTO refresh_tokens (token) VALUES(?)",
                [refreshToken],
                (err) => {
                  if (err) throw err;
                }
              );

              res.cookie("accessToken", accessToken, {
                expires: new Date(Date.now() + 1000 * 60 * 32),
              });

              res.cookie("refreshToken", refreshToken, {});

              res.json({ accessToken: accessToken, auth: true });
            } else {
              res.json({
                message: "Incorrect email and/or password",
                auth: false,
              });
            }
          });
        } else {
          res.json({
            message: "Incorrect email and/or password",
            auth: false,
          });
        }
      }
    );
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "32m",
  });
}

app.get("/verify-auth", (req, res) => {
  const token = req.headers.authorization;
  if (token === null) {
    return res.json({ auth: false, email: null });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, email, username) => {
    if (err) {
      return res.json({ auth: false, email: null });
    }
    res.json({ auth: true, email: email, username: username });
  });
});

/*---------------------------------------------------------*\
                  Uploading system
/*---------------------------------------------------------*/

let numberOfReceivedFiles = [];
let filesArray = [];
let prevRelativePath = [];
let foldersArray = [];
let uploadedFoldersArray = [];

function createFolders(i, user) {
  let relativePathLength =
    filesArray[i].path.length < prevRelativePath.length
      ? filesArray[i].path.length
      : prevRelativePath.length;
  let newRelativePath = false;

  for (let j = 0; j <= relativePathLength; j++) {
    if (
      (filesArray[i].path[j] && !prevRelativePath[j]) ||
      (filesArray[i].path[j] &&
        filesArray[i].path[j] !== prevRelativePath[j].path &&
        filesArray[i].user === prevRelativePath[j].user)
    ) {
      foldersArray.push({
        name: filesArray[i].path[j],
        uniqueName: generateUniqueId(),
        path: JSON.parse(JSON.stringify(filesArray[i].path)),
        uniquePath: [],
        public: false,
        nestedPosition: j,
        size: 0,
        user: user.username,
      });
      newRelativePath = true;
    }
  }
  if (newRelativePath)
    prevRelativePath = { path: filesArray[i].path, user: filesArray[i].user };
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
    let upload = true;
    if (uploadedFoldersArray.length > 0) {
      upload = !uploadedFoldersArray.find(
        (folder) =>
          folder.uniqueName === foldersArray[m].uniqueName &&
          folder.nestedPosition === foldersArray[m].nestedPosition
      );
    }
    database.query(
      "UPDATE data SET size = ? WHERE user_username = ? AND unique_identifier = ?",
      [foldersArray[m].size, user.username, foldersArray[m].uniqueName],
      () => {
        if (upload) {
          uploadedFoldersArray.push(
            JSON.parse(JSON.stringify(foldersArray[m]))
          );
          // delete the folder name from the path
          let folder = JSON.parse(JSON.stringify(foldersArray[m]));
          folder.path.pop();
          folder.path = folder.path.join("/");
          folder.uniquePath = foldersArray[m].uniquePath.join("/");
          storeData(folder, "folder");
        }
      }
    );
  }
}

async function combineChunks(chunkFilePaths, fileId) {
  let combinedStream = fs.createWriteStream(
    path.join("./uploads/files/", fileId),
    {
      flags: "a",
    }
  ); // Create or append to the combined file

  for (let a = 0; a < chunkFilePaths.length; a++) {
    const chunkStream = fs.createReadStream(
      path.join("./uploads/chunks/", chunkFilePaths[a])
    );

    await new Promise((resolve, reject) => {
      chunkStream.pipe(combinedStream, { end: false }); // Pipe the chunk to the combined file stream

      chunkStream.on("end", () => {
        combinedStream.write("\n"); // Add a separator between chunks
        fs.unlinkSync(path.join("./uploads/chunks/", chunkFilePaths[a])); // Delete the processed chunk file
        resolve();
      });

      // chunkStream.on("error", (error) => {
      //   reject(error);
      // });
    });
  }
  combinedStream.end(); // Close the combined file stream
}

/*-------------Multer configuration --------------------*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/chunks/");
  },
  filename: (req, file, cb) => {
    const user = getUser(req.cookies);
    const chunkName =
      req.body.resumableIdentifier +
      "-" +
      (Number(req.body.resumableChunkNumber) - 1);
    //set variable to false to let the program know that a chunk was not added(default)
    let chunkAdded = false;
    //verify if are any chunks in the files array
    if (filesArray.length > 0) {
      //find the file that match the current resumable unique identifier
      filesArray.forEach((fileData) => {
        if (
          fileData.uniqueIdentifier === req.body.resumableIdentifier &&
          fileData.user === user.username &&
          user !== null
        ) {
          //if it found a match add the resumable chunk in the chunks array on th chunk number position - 1
          fileData.chunks[Number(req.body.resumableChunkNumber) - 1] =
            chunkName;
          chunkAdded = true;
        }
      });
    }
    //if it didn't find a resumabke identifier match or the files array is empty add a new object in the files array with the necessarry data
    if (!chunkAdded) {
      //if the file has a relative path adn the relative path array is longer that 1 means the file in in a folder
      let fileRelativePath = req.body.resumableRelativePath.split("/");
      if (fileRelativePath) {
        //delete the last element(the file name) from the path
        fileRelativePath.pop();
      } else fileRelativePath = [];
      filesArray.push({
        name: req.body.resumableFilename,
        uniqueName: null,
        uniqueIdentifier: req.body.resumableIdentifier,
        totalChunks: Number(req.body.resumableTotalChunks),
        path: fileRelativePath,
        uniquePath: [],
        size: Number(req.body.resumableTotalSize),
        public: false,
        status: 0,
        chunks: [],
        user: user.username,
      });
      //add the cunk
      filesArray[filesArray.length - 1].chunks[
        Number(req.body.resumableChunkNumber) - 1
      ] = chunkName;
    }
    cb(null, chunkName);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.array("file"), (req, res) => {
  //verify if any of the files got all the chunks
  (async () => {
    let promises = [];
    for (let i = 0; i < filesArray.length; i++) {
      //if the array chunks has the length of the resumabel total chunks add the file in the database and on th disk storage
      let missingChunks = false;
      for (let j = 0; j < filesArray[i].chunks.length; j++) {
        if (filesArray[i].chunks[j] === undefined) {
          missingChunks = true;
        }
      }
      if (
        filesArray[i].totalChunks === filesArray[i].chunks.length &&
        //means that the file was not already uploaded
        filesArray[i].status === 0 &&
        !missingChunks
      ) {
        const user = getUser(req.cookies);
        if (user) {
          //set the file status to uploading
          filesArray[i].status = 1;

          let fileId;
          if (filesArray[i].name.match(/\.([^.]+)$/)) {
            fileId =
              generateUniqueId() +
              "." +
              filesArray[i].name.match(/\.([^.]+)$/)[1];
          } else {
            fileId = generateUniqueId();
          }

          if (filesArray[i].path.length > 0) {
            //get the folders from files relative path
            createFolders(i, user);
            //remove the last element (the current folder name) from the path array
            getFoldersPath();
            //se file unique path by checnking the folders path with the files path
            setFileUniquePath(i);
            //reset the variables after uploading all the files
            uploadFolders(user);
          }

          //check if the path is not empty to prevent getting error
          filesArray[i].uniqueName = fileId;
          filesArray[i].path =
            filesArray[i].path.length > 0 ? filesArray[i].path.join("/") : "";

          //check if the path is not empty to prevent getting error
          filesArray[i].uniquePath =
            filesArray[i].uniquePath.length > 0
              ? filesArray[i].uniquePath.join("/")
              : "";

          const promise = combineChunks(
            filesArray[i].chunks,
            filesArray[i].uniqueName
          )
            .then(() => {
              //delete the added file
              storeData(filesArray[i], "file");
              filesArray.splice(i, 1);
              i--;
              let firstUserFile = true;
              //got trough received files array
              for (
                let numberOfReceivedFilesIndex = 0;
                numberOfReceivedFilesIndex < filesArray.length;
                numberOfReceivedFilesIndex++
              ) {
                //if the user from the received files array matches the user tha is curently uploading increase the received files for that user
                if (
                  numberOfReceivedFiles[numberOfReceivedFilesIndex] &&
                  numberOfReceivedFiles[numberOfReceivedFilesIndex].user ===
                    user.username
                ) {
                  numberOfReceivedFiles[numberOfReceivedFilesIndex]
                    .receivedFiles++;
                  firstUserFile = false;
                }
              }
              //if the user is uploading his first file push a new object
              if (firstUserFile) {
                numberOfReceivedFiles.push({
                  user: user.username,
                  receivedFiles: 1,
                  totalFiles: Number(req.headers.numberoffiles),
                });
              }
              //go again trough the uploaded files array
              for (
                let numberOfReceivedFilesIndex = 0;
                numberOfReceivedFilesIndex < filesArray.length;
                numberOfReceivedFilesIndex++
              ) {
                //if the user has received all the files delete all the unecessarry data
                if (
                  numberOfReceivedFiles[numberOfReceivedFilesIndex] &&
                  numberOfReceivedFiles[numberOfReceivedFilesIndex]
                    .receivedFiles ===
                    numberOfReceivedFiles[numberOfReceivedFilesIndex]
                      .totalFiles &&
                  numberOfReceivedFiles[numberOfReceivedFilesIndex].user ===
                    user.username
                ) {
                  foldersArray = resetData(foldersArray, user);
                  filesArray = resetData(filesArray, user);
                  uploadedFoldersArray = resetData(uploadedFoldersArray, user);
                  prevRelativePath = resetData(prevRelativePath, user);
                  numberOfReceivedFiles = resetData(
                    numberOfReceivedFiles,
                    user
                  );
                }
              }
              res.send("File uploaded successfully");
            })
            .catch((error) => {
              console.error("Error combining chunks:", error);
            });
          promises.push(promise);
          await Promise.all(promises);
        } else {
          return res.status(401).json({ error: "Unauthorized user" });
        }
      }
      if (
        filesArray[i] &&
        Number(filesArray[i].totalChunks) !==
          Number(filesArray[i].chunks.length)
      ) {
        return res.send("Chunk received");
      }
    }
  })().catch((err) => {
    console.log(err);
    return res.status(401).json({ error: "An error occured" });
  });
});

/*---------------------------------------------------------*\
                  Create Folders
/*---------------------------------------------------------*/

app.post("/create-folder", (req, res) => {
  const user = getUser(req.body);
  if (user !== null) {
    const { name, isPublic, frontendPath, uniquePath } = req.body;
    const data = {
      name: name,
      uniqueName: generateUniqueId(),
      path: frontendPath,
      uniquePath: uniquePath,
      size: 0,
      public: isPublic,
      user: user.username,
    };
    storeData(data, "folder");
    res.json({ message: "Folder created successfully" });
  } else {
    res.json({ message: "User not authorized" });
  }
});

/*---------------------------------------------------------*\
                  Get data and reset data
/*---------------------------------------------------------*/

function resetData(data, user) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].user === user.username) {
      data.splice(i, 1);
    }
  }
  return data;
}

app.post("/reset-data", (req, res) => {
  const user = getUser(req.body);
  if (user) {
    foldersArray = resetData(foldersArray, user);
    filesArray = resetData(filesArray, user);
    uploadedFoldersArray = resetData(uploadedFoldersArray, user);
    prevRelativePath = resetData(prevRelativePath, user);
    numberOfReceivedFiles = resetData(numberOfReceivedFiles, user);
    res.json({ message: "The data has been reseted" });
  }
});

app.get("/fetch-data", (req, res) => {
  const user = getUser(req.cookies);
  if (user) {
    database.query(
      "SELECT * FROM data WHERE user_username=?",
      [user.username],
      (err, result) => {
        if (err) throw err;
        const currentTime = new Date();
        const oneWeekMills = 7 * 24 * 60 * 60 * 1000;

        let starredData = [];
        let publicData = [];
        let recentData = [];
        let deletedData = [];
        let folders = [];
        let rootData = [];

        folders[0] = {
          frontend_path: "/",
          unique_path: "",
        };

        result.forEach((data) => {
          const fileLastAccessed = data.last_accessed;
          data.last_accessed = getFormatedDate(data.last_accessed);
          data.creation_date = getFormatedDate(data.creation_date);
          if (data.deletion_time) {
            data.deletion_date = getFormatedDate(data.deletion_date);
            deletedData.push(data);
          } else {
            if (data.starred) {
              starredData.push(data);
            }
            if (data.public) {
              publicData.push(data);
            }
            if (
              currentTime.getTime() - fileLastAccessed.getTime() >
              oneWeekMills
            ) {
              recentData.push(data);
            }
            if (data.frontend_path === "") {
              rootData.push(data);
            }
            if (data.type === "folder") {
              const frontendPath =
                data.frontend_path.length > 0 ? data.frontend_path + "/" : "";
              const uniquePath =
                data.unique_path.length > 0 ? data.unique_path + "/" : "";
              const folder = {
                frontend_path: "/" + frontendPath + data.name + "/",
                unique_path: uniquePath + data.unique_identifier,
              };
              folders.push(folder);
            }
          }
        });
        res.json({
          rootData: rootData,
          folders: folders,
          deletedData: deletedData,
          recentData: recentData,
          publicData: publicData,
          starredData: starredData,
        });
      }
    );
  }
});

// app.get("/upload", (req, res) => {
//   res.json(true);
// });

app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
