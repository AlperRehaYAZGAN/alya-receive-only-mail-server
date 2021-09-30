// os depeendencies
const path = require("path");
require("dotenv").config({
  path: path.join(process.cwd(), ".env") /* init .env */,
});

const SMTPServer = require("smtp-server").SMTPServer;
const smtpParser = require("mailparser").simpleParser;

// database
const level = require("level");
const dbMails = level(path.join(process.cwd(), "data", "mailsleveldb"));
const dbErrors = level(path.join(process.cwd(), "data", "errorsleveldb"));

async function saveMailToDb(storeValue) {
  const storeKey = new Date().toISOString();
  // store in db
  await dbMails.put(storeKey, storeValue);
}

async function saveMailErrorToDb(err) {
  const storeKey = new Date().toISOString();
  // store in db
  await dbErrors.put(storeKey, err);
}

const mailServer = new SMTPServer({
  size: 1024 * 512 * 1, // allow messages up to 512 kb
  onData(stream, session, callback) {
    smtpParser(stream, {}, (err, parsed) => {
      if (err) {
        saveMailErrorToDb({
          date: new Date().toISOString(),
          incomingData: "Error:",
          errorMsg: err.message || "could not read err.message",
        });
      }

      let errSize;
      if (stream.sizeExceeded) {
        saveMailErrorToDb({
          date: new Date().toISOString(),
          incomingData: null,
          errorMsg: "Maxs limit exceed",
        });
        errSize = new Error("Message exceeds fixed maximum message size");
        errSize.responseCode = 552;
        return callback(errSize);
      }

      saveMailToDb(parsed);
      callback();
    });
  },
  disabledCommands: ["AUTH"],
});

// http listening server
const express = require("express");
const app = express();
const appPort = process.env.APP_PORT || 9631;
const mailPort = process.env.MAIL_PORT || 25;

async function basicAuth(req, res, next) {
  // check for basic auth header
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return res.status(401).json({ message: "Missing Authorization Header" });
  }
  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");
  if (!(username == process.env.USERNAME && password == process.env.PASSWORD)) {
    return res
      .status(401)
      .json({ message: "Invalid Authentication Credentials" });
  }
  next();
}

app.get("/incomings/", basicAuth, async (req, res) => {
  try {
    var keys = [];
    dbMails
      .createReadStream({ keys: true, values: false })
      .on("data", function (data) {
        keys.push(process.env.APP_URL + "/incomings/" + data);
      })
      .on("error", function (err) {
        return res.status(500).json({ message: "Internal error occured" });
      })
      .on("close", function () {
        console.log("Stream closed: ", new Date().toISOString());
      })
      .on("end", function () {
        return res.status(200).json(keys);
      });
  } catch (e) {
    return res
      .status(404)
      .json({ message: "Error occured while finding incoming mails" });
  }
});

app.get("/incomings/:key", basicAuth, async (req, res) => {
  try {
    var key = req.params.key;
    return res.status(200).json({ value: await dbMails.get(key) });
  } catch (e) {
    return res.status(404).json({ value: "Not Found" });
  }
});

app.get("/errors/", basicAuth, async (req, res) => {
  try {
    var keys = [];
    dbErrors
      .createReadStream({ keys: true, values: false })
      .on("data", function (data) {
        keys.push(process.env.APP_URL + "/errors/" + data);
      })
      .on("error", function (err) {
        return res.status(500).json({ message: "Internal error occured" });
      })
      .on("close", function () {
        console.log("Stream closed: ", new Date().toISOString());
      })
      .on("end", function () {
        return res.status(200).json(keys);
      });
  } catch (e) {
    return res
      .status(404)
      .json({ message: "Error occured while finding incoming mails" });
  }
});

app.get("/errors/:key", basicAuth, async (req, res) => {
  try {
    var key = req.params.key;
    return res.status(200).json({ value: await dbErrors.get(key) });
  } catch (e) {
    return res.status(404).json({ value: "Not Found" });
  }
});

mailServer.listen(mailPort, "0.0.0.0");
console.log(`Mail Reciever Server Running on port ${mailPort}`);

app.listen(appPort, () => {
  console.log(
    `Mail app listening at ${process.env.APP_URL} and port is: ${appPort}`
  );
});
