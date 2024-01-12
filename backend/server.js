import express, { response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import argon2 from "argon2";
import multer from "multer";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import serveStatic from "serve-static";
import checkDiskSpace from "check-disk-space";
import cron from "node-cron";
import { v4 as uuidv4 } from "uuid";

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

app.use((req, res, next) => {
  res.on("finish", async () => {
    getUser(req.cookies)
      .then((user) => {
        const currentDate = new Date();
        const filePath = "./user_data.json";

        let userData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const userIndex = userData.findIndex(
          (userObj) => userObj.id === user.id
        );

        if (userIndex !== -1) {
          userData[userIndex].last_request_date = currentDate.getTime();
        } else {
          userData.push({
            id: user.id,
            last_request_date: currentDate.getTime(),
          });
        }
        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
      })
      .catch(() => {});
  });
  next();
});

function resetData(data, user) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].user === user.id) {
      data.splice(i, 1);
    }
  }
  return data;
}

async function processDeletions(result, user) {
  const currentTime = new Date();
  for (const data of result) {
    if (data.deletion_date.getTime() <= currentTime.getTime()) {
      try {
        await deleteData(user, data);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

function removeAllFilesFromFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", filePath, err);
        } else {
          console.log("Deleted file:", filePath);
        }
      });
    });
  });
}

cron.schedule("*/10 * * * *", () => {
  const currentDate = new Date();
  let userData = JSON.parse(fs.readFileSync("./user_data.json", "utf8"));
  userData
    .forEach((user) => {
      if (currentDate.getTime() - user.last_request_date > 10 * 60 * 1000) {
        foldersArray = resetData(foldersArray, user);
        filesArray = resetData(filesArray, user);
        numberOfReceivedFiles = resetData(numberOfReceivedFiles, user);

        removeAllFilesFromFolder(`./uploads/${user.id}/chunks`);
        removeAllFilesFromFolder(`./uploads/${user.id}/tmp_folder`);

        database.query(
          "SELECT * FROM data WHERE user_id = ? AND deletion_date IS NOT NULL",
          [user.id],
          (err, result) => {
            if (err) console.log(err);
            processDeletions(result, user)
              .then(() => {})
              .catch((err) => {
                console.error(err);
              });
          }
        );
      }
    })
    .catch(() => {});
  database.query("SELECT * FROM tokens", (err, result) => {
    if (err) console.log(err);
    else {
      const currentDate = new Date();
      result.forEach((token) => {
        if (
          currentDate.getTime() - token.access_token_refresh_date.getTime() >
          32 * 60 * 1000
        ) {
          database.query(
            "DELETE FROM tokens WHERE refresh_token = ?",
            [token.refresh_token],
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      });
    }
  });
  database.query("SELECT * FROM temporary_links", (err, result) => {
    if (err) console.log(err);
    else {
      const currentDate = new Date();
      result.forEach((link) => {
        if (
          currentDate.getTime() - link.creation_date.getTime() >
          60 * 60 * 1000
        ) {
          database.query(
            "DELETE FROM temporary_links WHERE link = ?",
            [link.link],
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      });
    }
  });
});

/*---------------------------------------------------------*\
                 General functions
/*---------------------------------------------------------*/

function validateRefreshToken(token) {
  return new Promise((resolve, reject) => {
    database.query("SELECT refresh_token FROM tokens", (err, tokens) => {
      if (err) {
        reject(err);
        return;
      }

      let isValid = tokens.some((tokenObj) => tokenObj.refresh_token === token);

      if (isValid) {
        jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
          if (err) isValid = false;
        });
      }

      resolve(isValid);
    });
  });
}

async function validateAccessToken(accessToken) {
  return await new Promise((resolve, reject) => {
    try {
      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      resolve(decodedToken);
    } catch (error) {
      resolve(null);
    }
  });
}

function getUser(cookies) {
  return new Promise((resolve, reject) => {
    validateRefreshToken(cookies.refreshToken).then((isValid) => {
      if (isValid) {
        validateAccessToken(cookies.accessToken).then((user) => {
          if (user) resolve(user);
          else reject();
        });
      } else {
        reject();
      }
    });
  });
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
      "INSERT INTO data (name,original_name, unique_identifier, frontend_path, unique_path, creation_date, last_accessed, size, type, starred, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.originalName,
        data.uniqueName,
        data.path, // Remove square brackets
        data.uniquePath, // Remove square brackets
        currentDate,
        currentDate,
        data.size || 0,
        type,
        false,
        data.user,
      ],
      (error) => {
        if (error) {
          // Handle the error here
          console.error("Error inserting data:", error);
        }
        resetDataAtTheEnd(data.user);
      }
    );
  }
}

function updateLastAccessedDate(uniqueIdentifier, user) {
  database.query(
    "UPDATE data SET last_accessed = ? WHERE unique_identifier = ? AND user_id = ?",
    [new Date(), uniqueIdentifier, user.id],
    (err) => {
      if (err) console.log(err);
    }
  );
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*---------------------------------------------------------*\
                  Authentication system
/*---------------------------------------------------------*/

app.post("/api/login", (req, res) => {
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
        if (err) console.log(err);
        if (data.length) {
          argon2
            .verify(data[0].password, password)
            .then((result) => {
              if (
                result &&
                (data[0].email === email_username ||
                  data[0].username === email_username)
              ) {
                const user = {
                  id: data[0].user_id,
                };

                if (!fs.existsSync(`./uploads/${user.id}/`)) {
                  // If it doesn't exist, create the folders
                  fs.mkdirSync(`./uploads/${user.id}/`);
                  fs.mkdirSync(`./uploads/${user.id}/files`);
                  fs.mkdirSync(`./uploads/${user.id}/chunks`);
                  fs.mkdirSync(`./uploads/${user.id}/tmp_folder`);
                }

                const accessToken = generateAccessToken(user);

                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
                database.query(
                  "INSERT INTO tokens (refresh_token, access_token_refresh_date, user_id) VALUES(?, ?, ?)",
                  [refreshToken, new Date(), user.id],
                  (err) => {
                    if (err) console.log(err);
                  }
                );

                res.cookie("accessToken", accessToken, {
                  expires: new Date(Date.now() + 1000 * 60 * 32),
                  secure: true,
                  httpOnly: true,
                });

                res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  secure: true,
                });

                res.json({ accessToken: accessToken, auth: true });
              } else {
                res.json({
                  message: "Incorrect email and/or password",
                  auth: false,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.json({
                message: "Incorrect email and/or password",
                auth: false,
              });
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

app.post("/api/logout", (req, res) => {
  const token = req.cookies.refreshToken;
  //see if the token exists
  validateRefreshToken(token)
    .then((isValid) => {
      if (isValid) {
        //delete it from the database
        database.query(
          "DELETE FROM tokens WHERE refresh_token=?",
          [token],
          (err) => {
            if (err) console.log(err);
            //clear the cookies
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            res.json({ logout: true });
          }
        );
      } else {
        res.json({ logout: true });
      }
    })
    .catch((error) => {
      res.json({ logout: false });
      console.error(error);
    });
});

app.post("/api/verify-auth", (req, res) => {
  if (req.cookies.accessToke === null || req.cookies.refreshToken === null) {
    res.json({ auth: false, email: null });
  } else {
    getUser(req.cookies)
      .then((user) => {
        res.json({ auth: true, email: user.email });
      })
      .catch(() => {
        res.json({ auth: false, email: null });
      });
  }
});

app.post("/api/refresh-token", (req, res) => {
  const { refreshTokenC, accessTokenC } = req.cookies;
  //check if the tokens exist
  if (refreshTokenC === null || accessTokenC === null) {
    res.clearCookie("refreshToken");
    res.clearCookie("accesshToken");
    res.json({ auth: false });
  } else {
    getUser(req.cookies)
      .then((user) => {
        const accessToken = generateAccessToken({
          id: user.id,
        });

        updateLastDateAccessTokenRefreshed(accessTokenC);

        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 32),
          secure: true,
          httpOnly: true,
        });

        res.json({ auth: true });
      })
      .catch(() => {
        res.json({ auth: false });
      });
  }
});

function updateLastDateAccessTokenRefreshed(refreshToken) {
  database.query(
    "UPDATE tokens SET access_token_refresh_date = ? WHERE refresh_token = ?",
    [refreshToken, new Date()],
    (err) => {
      if (err) console.log(err);
    }
  );
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "32m",
  });
}

/*---------------------------------------------------------*\
                  Uploading system
/*---------------------------------------------------------*/

let numberOfReceivedFiles = [];
let filesArray = [];
let foldersArray = [];

function checkFolderDuplication(i, j) {
  for (let p = 0; p < foldersArray.length; p++) {
    let tempPath = JSON.parse(JSON.stringify(filesArray[i].path));
    tempPath.splice(j + 1, tempPath.length - j);
    if (foldersArray[p].path.join("/") === tempPath.join("/")) {
      return false;
    }
  }
  return true;
}

function createFolders(i, user) {
  for (let j = 0; j < filesArray[i].path.length; j++) {
    if (checkFolderDuplication(i, j)) {
      const currentDate =
        "_" +
        new Date()
          .toISOString()
          .replace(/[-:.]/g, "")
          .replace("T", "")
          .slice(0, 14);
      let tempPath = JSON.parse(JSON.stringify(filesArray[i].path));
      tempPath.splice(j + 1, tempPath.length - j);
      foldersArray.push({
        name: filesArray[i].path[j],
        originalName: filesArray[i].path[j],
        uniqueName: uuidv4() + currentDate,
        path: tempPath,
        uniquePath: [],
        public: false,
        nestedPosition: j,
        uploaded: false,
        size: 0,
        user: user.id,
      });
    }
  }
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
      let folder1Path = JSON.parse(
        JSON.stringify(foldersArray[folderIndex1].path)
      );
      let folder2Path = JSON.parse(
        JSON.stringify(foldersArray[folderIndex2].path)
      );
      // folder1Path.pop();
      folder2Path.splice(
        foldersArray[folderIndex1].nestedPosition + 1,
        folder2Path.length - foldersArray[folderIndex1].nestedPosition
      );
      if (
        folderIndex1 !== folderIndex2 &&
        foldersArray[folderIndex2].path.length >=
          foldersArray[folderIndex1].nestedPosition &&
        folder1Path.join("/") === folder2Path.join("/")
        // foldersArray[folderIndex1].name ===
        //   foldersArray[folderIndex2].path[
        //     foldersArray[folderIndex1].nestedPosition
        //   ]
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
        if (
          foldersArray[k].path.length > 0 &&
          filesArray[i].path[l] !== foldersArray[k].path[l]
        ) {
          isEqual = false;
          break;
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
        // foldersArray[k].size += filesArray[i].size;
        filesArray[i].uniquePath = JSON.parse(
          JSON.stringify([...foldersArray[k].uniquePath])
        ); // Make a copy
        filesArray[i].uniquePath.push(
          JSON.parse(JSON.stringify(foldersArray[k].uniqueName))
        ); // Add uniqueName to the copied array
      }
    }
  }
}

function updateFolderSize(file, user) {
  if (file.uniquePath.length) {
    file.uniquePath.split("/").forEach((folderId) => {
      database.query(
        "SELECT * FROM data WHERE unique_identifier = ? AND user_id = ?",
        [folderId, user.id],
        (err, result) => {
          if (err) console.log(err);
          else if (result.length) {
            database.query(
              "UPDATE data SET size = ? WHERE unique_identifier = ? AND user_id = ?",
              [Number(result[0].size) + Number(file.size), folderId, user.id],
              (err) => {
                if (err) console.log(err);
              }
            );
          }
        }
      );
    });
  }
}

function uploadFolders(user) {
  for (let m = 0; m < foldersArray.length; m++) {
    if (!foldersArray[m].uploaded) {
      database.query(
        "UPDATE data SET size = ? WHERE user_id = ? AND unique_identifier = ?",
        [foldersArray[m].size, user.id, foldersArray[m].uniqueName],
        () => {
          foldersArray[m].uploaded = true;
          let folder = JSON.parse(JSON.stringify(foldersArray[m]));
          folder.path.pop();
          folder.path = folder.path.join("/");
          folder.uniquePath = foldersArray[m].uniquePath.join("/");
          storeData(folder, "folder");
        }
      );
    }
  }
}

function resetDataAtTheEnd(user) {
  //go again trough the uploaded files array
  for (
    let numberOfReceivedFilesIndex = 0;
    numberOfReceivedFilesIndex < numberOfReceivedFiles.length;
    numberOfReceivedFilesIndex++
  ) {
    //if the user has received all the files delete all the unecessarry data
    if (
      numberOfReceivedFiles[numberOfReceivedFilesIndex].receivedFiles ===
        numberOfReceivedFiles[numberOfReceivedFilesIndex].totalFiles &&
      numberOfReceivedFiles[numberOfReceivedFilesIndex].user === user
    ) {
      foldersArray = resetData(foldersArray, { id: user });
      filesArray = resetData(filesArray, { id: user });
      numberOfReceivedFiles = resetData(numberOfReceivedFiles, { id: user });
    }
  }
}

async function combineChunks(chunkFilePaths, fileId, user) {
  let combinedStream = fs.createWriteStream(
    path.join(`./uploads/${user.id}/files`, fileId),
    {
      flags: "a",
    }
  ); // Create or append to the combined file

  for (let a = 0; a < chunkFilePaths.length; a++) {
    const chunkStream = fs.createReadStream(
      path.join(`./uploads/${user.id}/chunks`, chunkFilePaths[a])
    );

    await new Promise((resolve, reject) => {
      chunkStream.pipe(combinedStream, { end: false }); // Pipe the chunk to the combined file stream

      chunkStream.on("end", () => {
        fs.unlinkSync(
          path.join(`./uploads/${user.id}/chunks`, chunkFilePaths[a])
        ); // Delete the processed chunk file
        resolve();
      });

      chunkStream.on("error", (error) => {
        reject(error);
      });
    });
  }
  combinedStream.end(); // Close the combined file stream
}

/*-------------Multer configuration --------------------*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    getUser(req.cookies)
      .then((user) => {
        cb(null, `./uploads/${user.id}/chunks/`);
      })
      .catch(() => {
        cb(null, null);
      });
  },
  filename: (req, file, cb) => {
    getUser(req.cookies)
      .then((user) => {
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
              fileData.user === user.id &&
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
            originalName: req.body.resumableFilename,
            uniqueName: null,
            uniqueIdentifier: req.body.resumableIdentifier,
            totalChunks: Number(req.body.resumableTotalChunks),
            path: fileRelativePath,
            uniquePath: [],
            size: Number(req.body.resumableTotalSize),
            public: false,
            status: 0,
            chunks: [],
            user: user.id,
          });
          //add the cunk
          filesArray[filesArray.length - 1].chunks[
            Number(req.body.resumableChunkNumber) - 1
          ] = chunkName;
        }
        cb(null, chunkName);
      })
      .catch(() => {
        cb(null, null);
      });
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.array("file"), (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      //verify if any of the files got all the chunks
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
          //set the file status to uploading
          filesArray[i].status = 1;

          let fileId;
          const currentDate =
            "_" +
            new Date()
              .toISOString()
              .replace(/[-:.]/g, "")
              .replace("T", "")
              .slice(0, 14);
          if (filesArray[i].name.match(/\.([^.]+)$/)) {
            fileId =
              uuidv4() +
              currentDate +
              "." +
              filesArray[i].name.match(/\.([^.]+)$/)[1];
          } else {
            fileId = uuidv4() + currentDate;
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

          combineChunks(filesArray[i].chunks, filesArray[i].uniqueName, user)
            .then(() => {
              updateFolderSize(filesArray[i], user);
              //delete the added file
              storeData(filesArray[i], "file");
              filesArray.splice(i, 1);
              i--;
              let firstUserFile = true;
              for (
                let numberOfReceivedFilesIndex = 0;
                numberOfReceivedFilesIndex < numberOfReceivedFiles.length;
                numberOfReceivedFilesIndex++
              ) {
                //if the user from the received files array matches the user tha is curently uploading increase the received files for that user
                if (
                  numberOfReceivedFiles[numberOfReceivedFilesIndex].user ===
                  user.id
                ) {
                  numberOfReceivedFiles[numberOfReceivedFilesIndex]
                    .receivedFiles++;
                  firstUserFile = false;
                }
              }
              //if the user is uploading his first file push a new object
              if (firstUserFile) {
                numberOfReceivedFiles.push({
                  user: user.id,
                  receivedFiles: 1,
                  totalFiles: Number(req.headers.numberoffiles),
                });
              }
              res.send("File uploaded successfully");
            })
            .catch((error) => {
              console.error("Error combining chunks:", error);
            });
        }
        if (
          filesArray[i] &&
          Number(filesArray[i].totalChunks) !==
            Number(filesArray[i].chunks.length)
        ) {
          res.send("Chunk received");
        }
      }
    })
    .catch(() => {
      res.json({ error: "Unauthorized user" });
    });
});

/*---------------------------------------------------------*\
                  Download system
/*---------------------------------------------------------*/

async function moveFile(obj, user, data) {
  return new Promise((resolve, reject) => {
    if (obj.unique_path.split("/").includes(data.unique_identifier)) {
      const targetPath = `./uploads/${user.id}/tmp_folder/${obj.frontend_path}/`;
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
      }
      if (obj.type === "file") {
        fs.copyFile(
          `./uploads/${user.id}/files/${obj.unique_identifier}`,
          targetPath + obj.name,
          (err) => {
            if (err) {
              console.error(`Error moving the file: ${err}`);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}

const moveAllFiles = (result, user, data) => {
  const promises = result.map((obj) => moveFile(obj, user, data));
  return Promise.all(promises);
};

function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    archive
      .directory(sourceDir, false)
      .on("error", (err) => {
        reject(err);
      })
      .pipe(stream);

    stream.on("close", () => {
      resolve();
    });

    archive.finalize();
  });
}

app.post("/api/download", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { data } = req.body;
      updateLastAccessedDate(data.unique_identifier, user);
      database.query(
        "SELECT * FROM data WHERE user_id = ? AND unique_identifier = ?",
        [user.id, data.unique_identifier],
        (err, dataName) => {
          if (err) {
            console.log(err);
            res.json({});
          } else if (dataName.length) {
            if (data.type === "file") {
              const file = path.resolve(
                path.normalize(
                  `uploads/${user.id}/files/${data.unique_identifier}`
                )
              );
              fs.access(file, fs.constants.F_OK, (err) => {
                if (err) {
                  res.json({});
                } else {
                  res.sendFile(file, (err) => {
                    if (err) console.log(err);
                  });
                }
              });
            } else {
              database.query(
                "SELECT * FROM data WHERE user_id=?",
                [user.id],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    res.json({});
                  } else {
                    moveAllFiles(result, user, data)
                      .then(() => {
                        zipDirectory(
                          `uploads/${user.id}/tmp_folder/${data.name}`,
                          `uploads/${user.id}/tmp_folder/${data.name}.zip`
                        )
                          .then(() => {
                            fs.rm(
                              `uploads/${user.id}/tmp_folder/${data.name}`,
                              { recursive: true },
                              (err) => {
                                if (err) {
                                  console.error(
                                    `Error deleting folder: ${err.message}. User: ${user.id}`
                                  );
                                }
                              }
                            );
                            res.sendFile(
                              path.resolve(
                                `uploads/${user.id}/tmp_folder/${data.name}.zip`
                              ),
                              (err) => {
                                if (err) console.log(err);
                              }
                            );
                          })
                          .catch((err) => console.error(err));
                      })
                      .catch((error) => {
                        console.error(`Error moving files: ${error}`);
                      });
                  }
                }
              );
            }
          }
        }
      );
    })
    .catch(() => {
      res.send({ message: "Unauthorized user!" });
    });
});

app.post("/api/delete-downloaded-folder", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { folderName } = req.body;
      fs.rm(
        `uploads/${user.id}/tmp_folder/${folderName}.zip`,
        { recursive: true },
        (err) => {
          if (err) {
            console.error(
              `Error deleting folder: ${err.message}. User: ${user.id}`
            );
          }
          res.json({});
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*---------------------------------------------------------*\
                  Temporary link
/*---------------------------------------------------------*/

async function validateTemporaryLink(link) {
  return await new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM temporary_links WHERE link = ?",
      [link],
      (err, linkData) => {
        const currentDate = new Date();
        if (err) return reject(err);
        else if (
          linkData.length &&
          currentDate.getTime() - linkData[0].creation_date.getTime() <
            60 * 60 * 1000
        ) {
          database.query(
            "SELECT * FROM data WHERE data_id = ?",
            [linkData[0].data_id],
            (err, data) => {
              if (data) {
                resolve(data[0]);
              } else reject(err);
            }
          );
        } else reject("Link unavailable");
      }
    );
  });
}

app.post("/api/get-data-name", (req, res) => {
  const { link } = req.body;
  validateTemporaryLink(link)
    .then((data) => {
      res.json({ dataName: data.name });
    })
    .catch(() => {
      res.json({ dataName: "not_found" });
    });
});

app.post("/api/tmp-link-download", (req, res) => {
  const { link } = req.body;
  validateTemporaryLink(link)
    .then((data) => {
      const user = { id: data.user_id };
      if (data.type === "file") {
        const file = path.resolve(
          `uploads/${user.id}/files/${data.unique_identifier}`
        );
        fs.access(file, fs.constants.F_OK, (err) => {
          if (err) {
            res.json({});
          } else {
            res.sendFile(file, (err) => {
              if (err) console.log(err);
            });
          }
        });
      } else {
        database.query(
          "SELECT * FROM data WHERE user_id=?",
          [user.id],
          (err, result) => {
            if (err) {
              console.log(err);
              res.json({});
            } else {
              moveAllFiles(result, user, data)
                .then(() => {
                  zipDirectory(
                    `uploads/${user.id}/tmp_folder/${data.name}`,
                    `uploads/${user.id}/tmp_folder/${data.name}.zip`
                  )
                    .then(() => {
                      fs.rm(
                        `uploads/${user.id}/tmp_folder/${data.name}`,
                        { recursive: true },
                        (err) => {
                          if (err) {
                            console.log(
                              `Error deleting folder: ${err.message}. User: ${user.id}`
                            );
                          }
                        }
                      );
                      res.sendFile(
                        path.resolve(
                          `uploads/${user.id}/tmp_folder/${data.name}.zip`
                        ),
                        (err) => {
                          if (err) console.log(err);
                        }
                      );
                      res.setHeader("dataIsAvailable", 1);
                      res.setHeader("dataName", data.name);
                    })
                    .catch((err) => console.error(err));
                })
                .catch((error) => {
                  console.log(`Error moving files: ${error}`);
                });
            }
          }
        );
      }
    })
    .catch(() => {
      res.json({});
    });
});

app.post("/api/get-download-link", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { data } = req.body;
      database.query(
        "SELECT * FROM temporary_links WHERE unique_identifier = ? AND user_id = ?",
        [data.unique_identifier],
        user.id,
        (err, result) => {
          if (err) {
            console.log(err);
            res.json({ link: null });
          } else {
            if (result.length) res.json({ link: result[0].link });
            else res.json({ link: null });
          }
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

app.post("/api/generate-download-link", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { data } = req.body;
      const link = uuidv4();
      database.query(
        "INSERT INTO temporary_links (link, creation_date, data_id) VALUES (?,?,?)",
        [link, new Date(), data.data_id],
        (err) => {
          if (err) {
            console.log(err);
            res.json({ message: "Error generating the link" });
          } else {
            res.json({ link: link });
          }
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

app.post("/api/delete-download-link", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { data } = req.body;
      database.query(
        "DELETE FROM temporary_links WHERE data_id = ?",
        [data.data_id, user.id],
        (err) => {
          if (err) {
            console.log(err);
          }
          res.json();
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*---------------------------------------------------------*\
                  Create Folders
/*---------------------------------------------------------*/

app.post("/api/create-folder", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { name, isPublic, frontendPath, uniquePath } = req.body;
      const currentDate =
        "_" +
        new Date()
          .toISOString()
          .replace(/[-:.]/g, "")
          .replace("T", "")
          .slice(0, 14);
      const data = {
        name: name,
        originalName: name,
        uniqueName: uuidv4() + currentDate,
        path: frontendPath,
        uniquePath: uniquePath,
        size: 0,
        public: isPublic,
        user: user.id,
      };
      storeData(data, "folder");
      res.json({ message: "Folder created successfully" });
    })
    .catch(() => {
      res.json({ message: "Unauthorized user" });
    });
});

/*---------------------------------------------------------*\
                  Get data and reset data
/*---------------------------------------------------------*/

app.post("/api/fetch-data", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { dataCategory } = req.body;
      database.query(
        "SELECT * FROM data WHERE user_id=?",
        [user.id],
        (err, result) => {
          if (err) console.log(err);
          const currentTime = new Date();
          const oneWeekMills = 7 * 24 * 60 * 60 * 1000;

          let dataArray = [];
          let usedMemory = 0;

          result.forEach((data) => {
            if (data.type === "file") usedMemory += Number(data.size);
            // data.size = (Number(data.size) / Math.pow(1024, 2)).toFixed(2);
            const fileLastAccessed = data.last_accessed;
            data.last_accessed = getFormatedDate(data.last_accessed);
            data.creation_date = getFormatedDate(data.creation_date);
            if (data.deletion_date === null) {
              if (dataCategory === "dashboard" && data.frontend_path === "") {
                dataArray.push(data);
              } else if (
                dataCategory === "recents" &&
                currentTime.getTime() - fileLastAccessed.getTime() <
                  oneWeekMills
              ) {
                dataArray.push(data);
              } else if (dataCategory === "starred" && data.starred) {
                dataArray.push(data);
              }
              if (data.type === "folder" && dataCategory === "folders") {
                const frontendPath =
                  data.frontend_path.length > 0 ? data.frontend_path + "/" : "";
                const uniquePath =
                  data.unique_path.length > 0 ? data.unique_path + "/" : "";
                const folder = {
                  unique_identifier: data.unique_identifier,
                  size: data.size,
                  frontend_path: frontendPath + data.name,
                  unique_path: uniquePath + data.unique_identifier,
                };
                dataArray.push(folder);
              }
            } else if (dataCategory === "deleted") {
              dataArray.push(data);
            }
          });
          if (dataCategory === "folders") {
            dataArray.unshift({
              frontend_path: "/",
              unique_path: "",
              size: "0",
            });
          } else {
            dataArray = filterData(dataArray);
          }
          checkDiskSpace("/").then((diskSpace) => {
            const totalMemory = diskSpace.free + usedMemory;
            res.json({
              dataArray: dataArray,
              dataFound: true,
              totalMemory: totalMemory,
              usedMemory: usedMemory,
            });
          });
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

function filterData(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let dataIsNested = false;
    for (let j = 0; j < array.length; j++) {
      if (i !== j) {
        if (
          array[i].unique_path.split("/").includes(array[j].unique_identifier)
        ) {
          dataIsNested = true;
        }
      }
    }
    if (dataIsNested === false) {
      result.push(array[i]);
    }
  }
  return result;
}

/*---------------------------------------------------------*\
               Get current folder data
/*---------------------------------------------------------*/

app.post("/api/folder-data", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { folderIdentifier, page } = req.body;
      updateLastAccessedDate(folderIdentifier, user);
      database.query(
        "SELECT * FROM data WHERE user_id=?",
        [user.id],
        (err, result) => {
          if (err) console.log(err);
          let folderData;
          result.forEach((data) => {
            if (data.unique_identifier === folderIdentifier) {
              folderData = data;
            }
          });
          res.json({
            folderContent: getDataFromFolder(result, folderIdentifier, page),
            folderData: folderData,
          });
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

function getDataFromFolder(data, folderIdentifier, page) {
  const result = [];
  const currentTime = new Date();
  const oneWeekMills = 7 * 24 * 60 * 60 * 1000;

  for (const item of data) {
    let uniquePath = item.unique_path.split("/");
    if (uniquePath[uniquePath.length - 1] === folderIdentifier) {
      const fileLastAccessed = item.last_accessed;
      // item.size = (Number(item.size) / Math.pow(1024, 2)).toFixed(2);
      item.last_accessed = getFormatedDate(item.last_accessed);
      item.creation_date = getFormatedDate(item.creation_date);
      if (item.deletion_date !== null && page === "deleted") {
        result.push(item);
      } else if (
        item.deletion_date === null &&
        ((item.starred && page === "starred") ||
          (page === "recents" &&
            currentTime.getTime() - fileLastAccessed.getTime() <
              oneWeekMills) ||
          page === "dashboard")
      ) {
        result.push(item);
      }
    }
  }

  return result;
}

/*---------------------------------------------------------*\
                Data options endpoints
/*---------------------------------------------------------*/

/*----------------Set new name----------------*/

app.post("/api/rename-data", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { newName, data } = req.body;
      updateLastAccessedDate(data.unique_identifier, user);
      if (newName.length === 0) {
        res.json({
          message: `${capitalizeFirstLetter(data.type)} name cannot be empty!`,
        });
      } else {
        database.query(
          "UPDATE data SET name = ? WHERE user_id = ? AND unique_identifier = ?",
          [newName, user.id, data.unique_identifier],
          (err) => {
            if (err) {
              res.json({
                message: `Error changing ${capitalizeFirstLetter(
                  data.type
                )} name!`,
              });
              console.log(err);
            }
            res.json({
              message: `${capitalizeFirstLetter(
                data.type
              )} name changed succesfully!`,
            });
          }
        );
      }
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*----------------Set new path----------------*/

async function updateMovedDataFolderSize(location, size, method, user) {
  return await new Promise((resolve, reject) => {
    if (location.frontend_path) {
      location.unique_path.split("/").forEach((folder, index) => {
        database.query(
          "SELECT * FROM data WHERE user_id = ? AND unique_identifier = ?",
          [user.id, folder],
          (err, folderArr) => {
            if (err) reject(err);
            let newSize =
              method === "+"
                ? Number(folderArr.length ? folderArr[0].size : 0) + size //for updating the target folder size
                : Number(folderArr.length ? folderArr[0].size : 0) - size;
            database.query(
              "UPDATE data SET size = ? WHERE user_id = ? AND unique_identifier = ?",
              [newSize, user.id, folder],
              (err) => {
                if (err) reject(err);
                if (index === location.unique_path.split("/").length - 1)
                  resolve();
              }
            );
          }
        );
      });
    }
    resolve();
  });
}

app.post("/api/set-new-path", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      let { targetFolder, dataToMove } = req.body;
      updateLastAccessedDate(dataToMove.unique_identifier, user);
      //select all data
      if (targetFolder.unique_path !== dataToMove.unique_path) {
        database.query(
          "SELECT * FROM data WHERE user_id=?",
          [user.id],
          (err, result) => {
            if (err) console.log(err);
            let movedDataSize = 0;
            let rootLocation = true;
            result.forEach((data, index) => {
              //make an array with the folders from the path
              let dataUniquePathArray = data.unique_path.split("/");
              let dataFrontendPathArray = data.frontend_path.split("/");
              //go trough the file/folder unique path
              dataUniquePathArray.forEach((dataIdentifier, index) => {
                //if a folder from the unique path matches the name of the file/folder remove all the elements from 0 to the index of the folder that matches the name
                if (dataIdentifier === dataToMove.unique_identifier) {
                  dataUniquePathArray.splice(0, index);
                  dataFrontendPathArray.splice(0, index);
                  //put the path back together
                  dataFrontendPathArray = dataFrontendPathArray.join("/");
                  dataUniquePathArray = dataUniquePathArray.join("/");
                  database.query(
                    "UPDATE data SET frontend_path = ?, unique_path = ? WHERE user_id = ? AND unique_identifier = ?",
                    [
                      //when inserting put the new path at the begining and then connect it with the modify one to set all the files an folders to the new path
                      [targetFolder.frontend_path, dataFrontendPathArray].join(
                        "/"
                      ),
                      [targetFolder.unique_path, dataUniquePathArray].join("/"),
                      user.id,
                      data.unique_identifier,
                    ],
                    (err) => {
                      if (err) console.log(err);
                    }
                  );
                  movedDataSize += Number(data.size);
                  rootLocation = false;
                }
              });
              if (result.length === index + 1) {
                //move the folder/file to the chosen path
                database.query(
                  "UPDATE data SET frontend_path = ?, unique_path = ? WHERE user_id = ? AND unique_identifier = ?",
                  [
                    targetFolder.frontend_path,
                    targetFolder.unique_path,
                    user.id,
                    dataToMove.unique_identifier,
                  ],
                  (err) => {
                    if (err) {
                      console.log(err);
                    }
                    //uptdate the folder size
                    let updatePath = false;

                    let targetFolderUniquePath =
                      targetFolder.unique_path.split("/");
                    let dataToMoveUniquePath =
                      dataToMove.unique_path.split("/");

                    let pathLength = Math.min(
                      targetFolderUniquePath.length,
                      dataToMoveUniquePath.length
                    );

                    for (let i = 0; i < pathLength; i++) {
                      if (
                        dataToMoveUniquePath[i] === targetFolderUniquePath[i]
                      ) {
                        targetFolderUniquePath.splice(i, 1);
                        dataToMoveUniquePath.splice(i, 1);
                        pathLength--;
                        i--; // Decrement i to recheck the current index after deleting the element
                        updatePath = true;
                      }
                    }

                    if (updatePath) {
                      dataToMove.unique_path = dataToMoveUniquePath.join("/");
                      targetFolder.unique_path =
                        targetFolderUniquePath.join("/");
                    }

                    if (rootLocation) {
                      movedDataSize = Number(dataToMove.size);
                    }

                    updateMovedDataFolderSize(
                      dataToMove,
                      movedDataSize,
                      "-",
                      user
                    )
                      .then(() => {
                        updateMovedDataFolderSize(
                          targetFolder,
                          movedDataSize,
                          "+",
                          user
                        )
                          .then(() => {
                            res.json({
                              message: `${capitalizeFirstLetter(
                                dataToMove.type
                              )} moved succesfully!`,
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                            res.json({
                              message: "Error updating folder size.",
                            });
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                        res.json({
                          message: "Error updating folder size.",
                        });
                      });
                  }
                );
              }
            });
          }
        );
      } else {
        res.json({
          message: "Error moving data.",
        });
      }
    })
    .catch(() => {
      res.json({ message: "Unauthorized user" });
    });
});

/*----------------Add to starred----------------*/
/*----------------Remove from starred----------------*/

async function updateDataStarredStatus(user, data, starred) {
  return new Promise((resolve, reject) => {
    database.query(
      "UPDATE data SET starred = ? WHERE user_id = ? and unique_identifier = ?",
      [starred, user.id, data.unique_identifier],
      (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

app.post("/api/starred", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { condition, data } = req.body;
      updateLastAccessedDate(data.unique_identifier, user);
      if (data.type === "folder") {
        database.query(
          "SELECT * FROM data WHERE user_id = ?",
          [user.id],
          (err, result) => {
            if (err) {
              console.log(err);
              res.json({ message: "An error occurred!" });
            } else {
              result.forEach((resultData) => {
                if (
                  resultData.unique_path
                    .split("/")
                    .includes(data.unique_identifier)
                ) {
                  updateDataStarredStatus(user, resultData, condition).catch(
                    (err) => {
                      console.log(err);
                    }
                  );
                }
              });
            }
          }
        );
      }
      updateDataStarredStatus(user, data, condition)
        .then(() => {
          if (condition) {
            res.json({
              message: `${capitalizeFirstLetter(data.type)} added to starred!`,
            });
          } else {
            res.json({
              message: `${capitalizeFirstLetter(
                data.type
              )} removed from starred!`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(() => {
      res.json("Unauthorized user!");
    });
});

/*----------------Move to bin----------------*/
/*----------------Permanently delete----------------*/

function deleteData(user, data) {
  return new Promise((resolve, reject) => {
    database.query(
      "DELETE FROM temporary_links WHERE data_id = ?",
      [data.data_id],
      (err) => {
        if (err) throw err;
      }
    );
    database.query(
      "DELETE FROM data WHERE user_id = ? AND unique_identifier = ?",
      [user.id, data.unique_identifier],
      (err) => {
        if (err) {
          reject(err);
        } else {
          if (data.type === "file") {
            fs.unlink(
              `./uploads/${user.id}/files/${data.unique_identifier}`,
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          } else {
            resolve();
          }
        }
      }
    );
  });
}

async function setDeletionDate(user, data) {
  return new Promise((resolve, reject) => {
    let deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 7);
    database.query(
      "UPDATE data SET deletion_date = ? WHERE user_id = ? AND unique_identifier = ?",
      [deletionDate, user.id, data.unique_identifier],
      (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

app.post("/api/delete", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { data } = req.body;
      //select the
      if (data.deletion_date === null) {
        database.query(
          "SELECT * FROM data WHERE user_id = ? AND deletion_date IS NULL",
          [user.id],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.json({ message: "Error selecting data!" });
            } else {
              result.forEach((resultData) => {
                if (
                  resultData.unique_path
                    .split("/")
                    .includes(data.unique_identifier)
                ) {
                  setDeletionDate(user, resultData)
                    .then(() => {})
                    .catch((err) => {
                      console.log(err);
                    });
                }
              });
              setDeletionDate(user, data)
                .then(() => {
                  res.json({
                    message: `${capitalizeFirstLetter(
                      data.type
                    )} moved to bin!`,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res.json({
                    message: `Error moving ${data.type} to bin!`,
                  });
                });
            }
          }
        );
      } else {
        if (data.type === "folder") {
          database.query(
            "SELECT * FROM data WHERE user_id = ? AND deletion_date IS NOT NULL",
            [user.id],
            (err, result) => {
              {
                if (err) {
                  console.log(err);
                  res.json({ message: "Error selecting data!" });
                } else {
                  result.forEach((resultData) => {
                    if (
                      resultData.unique_path
                        .split("/")
                        .includes(data.unique_identifier)
                    ) {
                      deleteData(user, resultData).catch((err) => {
                        console.log(err);
                      });
                    }
                  });
                }
              }
            }
          );
        }
        deleteData(user, data)
          .then(() => {
            res.json({
              message: `${capitalizeFirstLetter(
                data.type
              )} deleted succesfully!`,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.json({
              message: `Error deleting the ${data.type}!`,
            });
          });
      }
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*----------------Delete remaining chunks----------------*/

async function deleteRemainingChunks(user) {
  return await new Promise((resolve, reject) => {
    fs.readdir(`./uploads/${user.id}/chunks/`, (err, files) => {
      if (err) {
        reject(err);
      } else {
        for (const file of files) {
          fs.unlink(
            path.join(`./uploads/${user.id}/chunks/`, file),
            (error) => {
              if (err) console.log(error);
            }
          );
        }
        resolve();
      }
    });
  });
}

app.post("/api/delete-chunks", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      deleteRemainingChunks(user)
        .then(() => {
          res.json({ message: "Chunks deleted successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: "Error deleting remaining chunks" });
        });
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*----------------Recover deleted data----------------*/

async function recoverData(user, data) {
  return new Promise((resolve, reject) => {
    database.query(
      "UPDATE data SET deletion_date = NULL WHERE user_id = ? AND unique_identifier = ?",
      [user.id, data.unique_identifier],
      (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

app.post("/api/recover", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { data } = req.body;
      database.query(
        "SELECT * FROM data WHERE user_id = ? AND deletion_date IS NOT NULL",
        [user.id],
        (err, result) => {
          if (err) console.log(err);
          result.forEach((resultData) => {
            if (
              resultData.unique_path.split("/").includes(data.unique_identifier)
            ) {
              recoverData(user, resultData).catch(() => {
                console.log(err);
                return res.json({
                  message: `Error recovering the ${data.type}!`,
                });
              });
            }
          });
          recoverData(user, data)
            .then(() => {
              data.unique_path.split("/").forEach((folderIdentifier) => {
                database.query(
                  "SELECT deletion_date FROM data WHERE user_id = ? AND unique_identifier = ?",
                  [user.id, folderIdentifier],
                  (err, folder) => {
                    for (let i = 0; i < folder.length; i++) {
                      if (folder[i].deletion_date) {
                        database.query(
                          "UPDATE data SET frontend_path = ?, unique_path = ? WHERE unique_identifier = ? AND user_id = ?",
                          ["", "", data.unique_identifier, user.id],
                          (err) => {
                            if (err) {
                              console.log(err);
                              return res.json({
                                message: `Error recovering the ${data.type}!`,
                              });
                            }
                          }
                        );
                        break;
                      }
                    }
                  }
                );
              });
              res.json({
                message: `${capitalizeFirstLetter(
                  data.type
                )} recoverd succesfully!`,
              });
            })
            .catch(() => {
              console.log(err);
              return res.json({
                message: `Error recovering the ${data.type}!`,
              });
            });
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*----------------Update folder last access time----------------*/

app.post("/api/update-last-access", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { folderIdentifier } = req.body;
      database.query(
        "UPDATE data SET last_accessed = ? WHERE user_id = ? AND unique_identifier = ? ",
        [new Date(), user.id, folderIdentifier],
        (err) => {
          if (err) {
            console.log(err);
            res.json({});
          } else
            res.json({ message: "Last accessed date updated succesfully!" });
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*----------------Search data system----------------*/

app.post("/api/search", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { query } = req.body;
      let dataArray = [];
      database.query(
        "SELECT * FROM data WHERE user_id = ?",
        [user.id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.json({});
          } else {
            let category = query[0];
            let folderName = query[1];
            let searchString = query[2];
            let searchArray = query[2].split("-");
            let currentTime = new Date();
            let oneWeekMills = 7 * 24 * 60 * 60 * 1000;
            dataArray = result.filter((obj) => {
              if (
                category.toLowerCase() === "deleted" &&
                obj.deletion_date !== null
              )
                return true;
              else if (obj.deletion_date === null) {
                if (category.toLowerCase() === "starred" && obj.starred === 1)
                  return true;
                else if (
                  category.toLowerCase() === "recents" &&
                  currentTime.getTime() - obj.last_accessed.getTime() <
                    oneWeekMills
                )
                  return true;
                else if (
                  category.toLowerCase() === "dashboard" &&
                  obj.deletion_date === null
                ) {
                  return true;
                }
              }
              return false;
            });
            dataArray = dataArray.filter((obj) => {
              if (
                category.toLowerCase() !== "dashboard" &&
                folderName === "/"
              ) {
                let notNested = true;
                notNested = !dataArray.find((obj2) =>
                  obj.unique_path.split("/").includes(obj2.unique_identifier)
                );
                if (notNested) return true;
              }
              if (
                (folderName === "/" && obj.frontend_path === "") ||
                folderName.toLowerCase() === "all" ||
                obj.frontend_path
                  .toLowerCase()
                  .split("/")
                  .includes(folderName.toLowerCase())
              )
                return true;
              return false;
            });
            searchArray.forEach((word) => {
              dataArray = dataArray.filter((obj) => {
                if (obj.name.toLowerCase().includes(word)) return true;
                return false;
              });
            });
            let tmpObj;
            dataArray.forEach((obj, index) => {
              obj.size = (Number(obj.size) / Math.pow(1024, 2)).toFixed(2);
              obj.last_accessed = getFormatedDate(obj.last_accessed);
              obj.creation_date = getFormatedDate(obj.creation_date);
              if (obj.name.toLowerCase().includes(searchString.toLowerCase())) {
                tmpObj = obj;
                dataArray.splice(index, 1);
                dataArray.unshift(tmpObj);
              }
            });
            res.json({ data: dataArray });
          }
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

app.post("/api/reset-data", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      foldersArray = resetData(foldersArray, user);
      filesArray = resetData(filesArray, user);
      numberOfReceivedFiles = resetData(numberOfReceivedFiles, user);
      res.json({ message: "Data cleared succesfully!" });
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

// if (process.env.NODE_ENV === "production") {
app.use(serveStatic("./public/"));
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});
// // }

app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
