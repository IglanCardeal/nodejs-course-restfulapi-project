process.env.UV_THREADPOOL_SIZE = 5;

const https = require("https");
const crypto = require("crypto");
const fs = require("fs");

const start = Date.now();

function doHash() {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log("Hash: ", Date.now() - start);
  });
}

function doRequest() {
  https
    .request("https://www.google.com", res => {
      res.on("data", () => {});
      res.on("end", () => {
        console.log("HTTPS: ", Date.now() - start);
      });
    })
    .end();
}

doRequest();

fs.readFile("./threads.js", () => {
  console.log("FS: ", Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();
