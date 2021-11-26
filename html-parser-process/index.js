var express = require("express");
var app = express();
const path = require("path");
const port = 3000;
const rf = require("fs");
app.get("/test.js", function (req, res, next) {
  res.setHeader("Content-Type", "text/javascript");
  const data = rf.readFileSync(path.join(__dirname, "public/test.js"));
  res.send(data);
});
app.get("/test1.js", function (req, res, next) {
  setTimeout(() => {
    res.setHeader("Content-Type", "text/javascript");
    const data = rf.readFileSync(path.join(__dirname, "public/test1.js"));
    res.send(data);
  }, 1000);
});
app.get("/test2.js", function (req, res, next) {
  setTimeout(() => {
    res.setHeader("Content-Type", "text/javascript");
    const data = rf.readFileSync(path.join(__dirname, "public/test2.js"));
    res.send(data);
  }, 2000);
});
app.get("/test3.js", function (req, res, next) {
  setTimeout(() => {
    res.setHeader("Content-Type", "text/javascript");
    const data = rf.readFileSync(path.join(__dirname, "public/test3.js"));
    res.send(data);
  }, 3000);
});
app.get("/test1.css", function (req, res, next) {
  res.setHeader("Content-Type", "text/css");
  setTimeout(() => {
    const data = rf.readFileSync(path.join(__dirname, "public/test1.css"));
    res.send(data);
  }, 3000);
});
app.get("/test.css", function (req, res, next) {
res.setHeader("Content-Type", "text/css");
  const data = rf.readFileSync(path.join(__dirname, "public/test.css"));
  res.send(data);
});
app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
