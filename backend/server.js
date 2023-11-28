import express, { response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import serveStatic from "serve-static";
import checkDiskSpace from "check-disk-space";
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
      "INSERT INTO data (name, unique_identifier, frontend_path, unique_path, creation_date, last_accessed, size, type, starred, user_username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.uniqueName,
        data.path, // Remove square brackets
        data.uniquePath, // Remove square brackets
        currentDate,
        currentDate,
        data.size,
        type,
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

function updateLastAccessedDate(uniqueIdentifier, user) {
  database.query(
    "UPDATE data SET last_accessed = ? WHERE unique_identifier = ? AND user_username = ?",
    [new Date(), uniqueIdentifier, user.username],
    (err, result) => {
      if (err) throw err;
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
          bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) console.log(err);
            if (
              result &&
              (data[0].email === email_username ||
                data[0].username === email_username)
            ) {
              const user = {
                email: data[0].email,
                username: data[0].username,
              };

              if (!fs.existsSync(`./uploads/${user.username}/`)) {
                // If it doesn't exist, create the folders
                fs.mkdirSync(`./uploads/${user.username}/`);
                fs.mkdirSync(`./uploads/${user.username}/files`);
                fs.mkdirSync(`./uploads/${user.username}/chunks`);
                fs.mkdirSync(`./uploads/${user.username}/tmp_folder`);
              } else {
                deleteRemainingChunks(user)
                  .then(() => {})
                  .catch((err) => {
                    throw err;
                  });
                fs.rm(
                  `uploads/${user.username}/tmp_folder`,
                  { recursive: true },
                  (err) => {
                    if (err) {
                      console.error(
                        `Error deleting folder: ${err.message}. User: ${user.username}`
                      );
                    }
                    fs.mkdirSync(`./uploads/${user.username}/tmp_folder`);
                  }
                );
              }

              resetMultipleData(user);

              const accessToken = generateAccessToken(user);

              const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
              database.query(
                "INSERT INTO tokens (refresh_token, access_token_refresh_date) VALUES(?, ?)",
                [refreshToken, new Date()],
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
          username: user.username,
          email: user.email,
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
      if (err) throw err;
    }
  );
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "32m",
  });
}
/*---------------------------------------------------------*\
         Remove old accesses tokens
/*---------------------------------------------------------*/

setInterval(() => {
  database.query("SELECT * FROM tokens", (err, result) => {
    if (err) throw err;
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
              throw err;
            }
          }
        );
      }
    });
  });
  database.query("SELECT * FROM temporary_links", (err, result) => {
    if (err) throw err;
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
              throw err;
            }
          }
        );
      }
    });
  });
}, 60 * 60 * 1000); // 1 hour in milliseconds

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
      let create = !uploadedFoldersArray.find(
        (folder) =>
          folder.name === filesArray[i].path[j] && folder.nestedPosition === j
      );
      if (create) {
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
  }
  if (newRelativePath)
    prevRelativePath.push({
      path: filesArray[i].path,
      user: filesArray[i].user,
    });
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
          folder.name === foldersArray[m].name &&
          folder.nestedPosition === foldersArray[m].nestedPosition
      );
    }
    if (upload) {
      database.query(
        "UPDATE data SET size = ? WHERE user_username = ? AND unique_identifier = ?",
        [foldersArray[m].size, user.username, foldersArray[m].uniqueName],
        () => {
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
      );
    }
  }
}

async function combineChunks(chunkFilePaths, fileId, user) {
  let combinedStream = fs.createWriteStream(
    path.join(`./uploads/${user.username}/files`, fileId),
    {
      flags: "a",
    }
  ); // Create or append to the combined file

  for (let a = 0; a < chunkFilePaths.length; a++) {
    const chunkStream = fs.createReadStream(
      path.join(`./uploads/${user.username}/chunks`, chunkFilePaths[a])
    );

    await new Promise((resolve, reject) => {
      chunkStream.pipe(combinedStream, { end: false }); // Pipe the chunk to the combined file stream

      chunkStream.on("end", () => {
        fs.unlinkSync(
          path.join(`./uploads/${user.username}/chunks`, chunkFilePaths[a])
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
        cb(null, `./uploads/${user.username}/chunks/`);
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
      })
      .catch(() => {
        cb(null, null);
      });
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.array("file"), (req, res) => {
  //verify if any of the files got all the chunks
  (async () => {
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
        await getUser(req.cookies)
          .then((user) => {
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

            combineChunks(filesArray[i].chunks, filesArray[i].uniqueName, user)
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
                    uploadedFoldersArray = resetData(
                      uploadedFoldersArray,
                      user
                    );
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
          })
          .catch(() => {
            res.json({ error: "Unauthorized user" });
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
  })().catch((err) => {
    res.json({ message: "An error occured" });
    console.log(err);
  });
});

/*---------------------------------------------------------*\
                  Download system
/*---------------------------------------------------------*/

async function moveFile(obj, user, data) {
  return new Promise((resolve, reject) => {
    if (obj.unique_path.split("/").includes(data.unique_identifier)) {
      const targetPath = `./uploads/${user.username}/tmp_folder/${obj.frontend_path}/`;
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
      }
      if (obj.type === "file") {
        fs.copyFile(
          `./uploads/${user.username}/files/${obj.unique_identifier}`,
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
      if (data.type === "file") {
        const file = path.resolve(
          `uploads/${user.username}/files/${data.unique_identifier}`
        );
        fs.access(file, fs.constants.F_OK, (err) => {
          if (err) {
            res.setHeader("dataIsAvailable", 0);
            res.json({});
          } else {
            res.setHeader("dataIsAvailable", 1);
            res.sendFile(file, (err) => {
              if (err) throw err;
            });
          }
        });
      } else {
        database.query(
          "SELECT * FROM data WHERE user_username=?",
          [user.username],
          (err, result) => {
            if (err) throw err;
            moveAllFiles(result, user, data)
              .then(() => {
                zipDirectory(
                  `uploads/${user.username}/tmp_folder/${data.name}`,
                  `uploads/${user.username}/tmp_folder/${data.name}.zip`
                )
                  .then(() => {
                    fs.rm(
                      `uploads/${user.username}/tmp_folder/${data.name}`,
                      { recursive: true },
                      (err) => {
                        if (err) {
                          console.error(
                            `Error deleting folder: ${err.message}. User: ${user.username}`
                          );
                        }
                      }
                    );
                    res.sendFile(
                      path.resolve(
                        `uploads/${user.username}/tmp_folder/${data.name}.zip`
                      ),
                      (err) => {
                        if (err) throw err;
                      }
                    );
                  })
                  .catch((err) => console.error(err));
              })
              .catch((error) => {
                console.error(`Error moving files: ${error}`);
              });
          }
        );
      }
    })
    .catch(() => {
      res.send({ message: "Unauthorized user!" });
    });
});

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
            "SELECT * FROM data WHERE unique_identifier = ?",
            [linkData[0].unique_identifier],
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

app.post("/api/tmp-link-download", (req, res) => {
  const { link } = req.body;
  validateTemporaryLink(link)
    .then((data) => {
      const user = { username: data.user_username };
      if (data.type === "file") {
        const file = path.resolve(
          `uploads/${user.username}/files/${data.unique_identifier}`
        );
        fs.access(file, fs.constants.F_OK, (err) => {
          if (err) {
            res.setHeader("dataIsAvailable", 0);
            res.json({});
          } else {
            res.setHeader("dataIsAvailable", 1);
            res.setHeader("dataName", data.name);
            res.sendFile(file, (err) => {
              if (err) throw err;
            });
          }
        });
      } else {
        database.query(
          "SELECT * FROM data WHERE user_username=?",
          [user.username],
          (err, result) => {
            if (err) throw err;
            moveAllFiles(result, user, data)
              .then(() => {
                zipDirectory(
                  `uploads/${user.username}/tmp_folder/${data.name}`,
                  `uploads/${user.username}/tmp_folder/${data.name}.zip`
                )
                  .then(() => {
                    fs.rm(
                      `uploads/${user.username}/tmp_folder/${data.name}`,
                      { recursive: true },
                      (err) => {
                        if (err) {
                          console.log(
                            `Error deleting folder: ${err.message}. User: ${user.username}`
                          );
                        }
                      }
                    );
                    res.sendFile(
                      path.resolve(
                        `uploads/${user.username}/tmp_folder/${data.name}.zip`
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
        );
      }
    })
    .catch(() => {
      res.setHeader("dataIsAvailable", 0);
      res.json({});
    });
});

app.post("/api/get-download-link", (req, res) => {
  getUser(req.cookies)
    .then(() => {
      const { data } = req.body;
      database.query(
        "SELECT * FROM temporary_links WHERE unique_identifier = ?",
        [data.unique_identifier],
        (err, result) => {
          if (err) throw err;
          if (result.length) res.json({ link: result[0].link });
          else res.json({ link: null });
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

app.post("/api/generate-download-link", (req, res) => {
  getUser(req.cookies).then((user) => {
    const { data } = req.body;
    const link = uuidv4();
    database.query(
      "INSERT INTO temporary_links (link, unique_identifier, creation_date, user) VALUES (?,?,?,?)",
      [link, data.unique_identifier, new Date(), user.username],
      (err) => {
        if (err) {
          console.log(err);
          res.json({ message: "Error generating the link" });
        } else {
          res.json({ link: link });
        }
      }
    );
  });
});

app.post("/api/delete-download-link", (req, res) => {
  getUser(req.cookies).then((user) => {
    const { data } = req.body;
    database.query(
      "DELETE FROM temporary_links WHERE unique_identifier = ?",
      [data.unique_identifier],
      (err) => {
        if (err) {
          console.log(err);
        }
        res.json();
      }
    );
  });
});

/*---------------------------------------------------------*\
                  Create Folders
/*---------------------------------------------------------*/

app.post("/api/create-folder", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
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
    })
    .catch(() => {
      res.json({ message: "Unauthorized user" });
    });
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

function resetMultipleData(user) {
  foldersArray = resetData(foldersArray, user);
  filesArray = resetData(filesArray, user);
  uploadedFoldersArray = resetData(uploadedFoldersArray, user);
  prevRelativePath = resetData(prevRelativePath, user);
  numberOfReceivedFiles = resetData(numberOfReceivedFiles, user);
}

app.post("/api/reset-data", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      resetMultipleData(user);
      res.json({ message: "The data has been reseted" });
    })
    .catch(() => {
      res.json({ message: "Unauthorized user" });
    });
});

app.post("/api/fetch-data", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { dataCategory } = req.body;
      database.query(
        "SELECT * FROM data WHERE user_username=?",
        [user.username],
        (err, result) => {
          if (err) console.log(err);
          const currentTime = new Date();
          const oneWeekMills = 7 * 24 * 60 * 60 * 1000;

          let dataArray = [];
          let usedMemory = 0;

          result.forEach((data) => {
            usedMemory += Number(data.size);
            data.size = (Number(data.size) / Math.pow(1024, 2)).toFixed(2);
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
                  frontend_path: "/" + frontendPath + data.name + "/",
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
            });
          } else {
            dataArray = filterData(dataArray);
          }
          checkDiskSpace("D:/").then((diskSpace) => {
            const freeMemory = (
              (diskSpace.free + usedMemory) /
              Math.pow(1024, 3)
            ).toFixed(2);
            usedMemory = usedMemory / Math.pow(1024, 3);
            usedMemory = usedMemory.toFixed(2);
            res.json({
              dataArray: dataArray,
              dataFound: true,
              freeMemory: freeMemory,
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
        "SELECT * FROM data WHERE user_username=?",
        [user.username],
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
      item.size = (Number(item.size) / Math.pow(1024, 2)).toFixed(2);
      item.last_accessed = getFormatedDate(item.last_accessed);
      item.creation_date = getFormatedDate(item.creation_date);
      if (item.deletion_date !== null && page === "deleted") {
        result.push(item);
      } else if (
        (item.starred && page === "starred") ||
        (page === "recents" &&
          currentTime.getTime() - fileLastAccessed.getTime() < oneWeekMills) ||
        page === "dashboard"
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
          "UPDATE data SET name = ? WHERE user_username = ? AND unique_identifier = ?",
          [newName, user.username, data.unique_identifier],
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

app.post("/api/set-new-path", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { targetFolder, dataToMove } = req.body;
      updateLastAccessedDate(dataToMove.unique_identifier, user);
      //select all data
      database.query(
        "SELECT * FROM data WHERE user_username=?",
        [user.username],
        (err, result) => {
          if (err) console.log(err);
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
                  "UPDATE data set frontend_path = ?, unique_path = ? WHERE user_username = ? AND unique_identifier = ?",
                  [
                    //when inserting put the new path at the begining and then cooect it with the modify one to set all the files an folders to the new path
                    [targetFolder.frontend_path, dataFrontendPathArray].join(
                      "/"
                    ),
                    [targetFolder.unique_path, dataUniquePathArray].join("/"),
                    user.username,
                    data.unique_identifier,
                  ],
                  (err) => {
                    if (err) console.log(err);
                  }
                );
              }
            });
            if (result.length === index + 1) {
              //move the folder/file to the chosen path
              database.query(
                "UPDATE data SET frontend_path = ?, unique_path = ? WHERE user_username = ? AND unique_identifier = ?",
                [
                  targetFolder.frontend_path,
                  targetFolder.unique_path,
                  user.username,
                  dataToMove.unique_identifier,
                ],
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                  //uptdate the folder size
                  database.query(
                    "UPDATE data SET size = ? WHERE user_username = ? AND unique_identifier = ?",
                    [
                      Number(targetFolder.size) + Number(dataToMove.size)
                        ? Number(targetFolder.size) + Number(dataToMove.size)
                        : 0,
                      user.username,
                      targetFolder.unique_identifier,
                    ],
                    (err) => {
                      if (err) console.log(err);
                      res.json({
                        message: `${capitalizeFirstLetter(
                          dataToMove.type
                        )} moved succesfully!`,
                      });
                    }
                  );
                }
              );
            }
          });
        }
      );
    })
    .catch(() => {
      res.status(401).json({ message: "Unauthorized user" });
    });
});

/*----------------Add to starred----------------*/
/*----------------Remove from starred----------------*/

async function updateDataStarredStatus(user, data, starred) {
  return new Promise((resolve, reject) => {
    database.query(
      "UPDATE data SET starred = ? WHERE user_username = ? and unique_identifier = ?",
      [starred, user.username, data.unique_identifier],
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
          "SELECT * FROM data WHERE user_username = ?",
          [user.username],
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
      "DELETE FROM data WHERE user_username = ? AND unique_identifier = ?",
      [user.username, data.unique_identifier],
      (err) => {
        if (err) {
          reject(err);
        } else {
          if (data.type === "file") {
            fs.unlink(
              `./uploads/${user.username}/files/${data.unique_identifier}`,
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
      "UPDATE data SET deletion_date = ? WHERE user_username = ? AND unique_identifier = ?",
      [deletionDate, user.username, data.unique_identifier],
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

app.post("/api/delete", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      const { data } = req.body;
      //select the
      if (data.deletion_date === null) {
        database.query(
          "SELECT * FROM data WHERE user_username = ? AND deletion_date IS NULL",
          [user.username],
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
            "SELECT * FROM data WHERE user_username = ? AND deletion_date IS NOT NULL",
            [user.username],
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
                        // return res.json({
                        //   message: `Error deleting the ${data.type}!`,
                        // });
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

/*----------------Auto delete date----------------*/

app.post("/api/auto-delete-data", (req, res) => {
  getUser(req.cookies)
    .then((user) => {
      database.query(
        "SELECT * FROM data WHERE user_username = ? AND deletion_date IS NOT NULL",
        [user.username],
        (err, result) => {
          if (err) console.log(err);
          processDeletions(result, user)
            .then(() => {
              res.json({ message: "Data deleted successfully" });
            })
            .catch((err) => {
              console.error(err);
              res.json({ message: "An error occurred while deleting data" });
            });
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

/*----------------Delete remaining chunks----------------*/

async function deleteRemainingChunks(user) {
  return await new Promise((resolve, reject) => {
    fs.readdir(`./uploads/${user.username}/chunks/`, (err, files) => {
      if (err) {
        reject(err);
      } else {
        for (const file of files) {
          fs.unlink(
            path.join(`./uploads/${user.username}/chunks/`, file),
            (error) => {
              if (err) throw error;
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
          res.json({ message: "Error deleting remaining chunks" });
          throw err;
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
      "UPDATE data SET deletion_date = NULL WHERE user_username = ? AND unique_identifier = ?",
      [user.username, data.unique_identifier],
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
        "SELECT * FROM data WHERE user_username = ? AND deletion_date IS NOT NULL",
        [user.username],
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
        "UPDATE data SET last_accessed = ? WHERE user_username = ? AND unique_identifier = ? ",
        [new Date(), user.username, folderIdentifier],
        (err) => {
          if (err) throw err;
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
        "SELECT * FROM data WHERE user_username = ?",
        [user.username],
        (err, result) => {
          if (err) throw err;
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
            if (category.toLowerCase() !== "dashboard" && folderName === "/") {
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
            if (obj.name.toLowerCase().includes(searchString.toLowerCase())) {
              tmpObj = obj;
              dataArray.splice(index, 1);
              dataArray.unshift(tmpObj);
            }
          });
          res.json({ data: dataArray });
        }
      );
    })
    .catch(() => {
      res.json({ message: "Unauthorized user!" });
    });
});

// if (process.env.NODE_ENV === "production") {
app.use(serveStatic("./public/"));
app.get(/.*/, (req, res) => {
  // res.sendFile(path.resolve("./public/index.html"));
});
// // }

app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
