const cors = require("cors");
const express = require("express");
const multer = require("multer");
const { createClient } = require("redis");
const path = require("node:path");
const fs = require("fs");

const client = createClient({ url: "redis://redis-service:6379" });
(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  // await client.set("key", "value");
  console.log("Redis Connected!");
  // const value = await client.get("que1");
  // console.log(value);
})();

try {
  // Create the directory if it doesn't exist
  fs.mkdirSync("/data/uploads", { recursive: true });
  fs.mkdirSync("/data/downs", { recursive: true });
  console.log(`Directory created or already exists: `);
} catch (err) {
  console.error(`Error creating directory: ${err.message}`);
}

const app = express();
app.use(cors());
app.set("view engine", "ejs");

function removeNonAlphabetic(str) {
  return str.replace(/[^a-zA-Z0-9.]/g, "");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.img_dir || "/data/uploads");
  },
  filename: function (req, file, cb) {
    // Set filename to req.body.group + original file extension
    const filename =
      removeNonAlphabetic(req.body.group) +
      "_" +
      removeNonAlphabetic(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
// Middleware to parse form data

app.post("/", upload.single("img"), (req, res) => {
  console.log("arrived");
  console.log("Form data:", req.body);

  const filename = req.file.filename;
  console.log("Filename: ", filename);
  client.LPUSH("music_que_1", filename);
  console.log("LPUSHED");
  res.send("Done");
});
app.get("/", (req, res) => {
  const data = {
    public_url: process.env.public_url || "http://localhost:30333",
  };
  res.render("index", data);
});

// Start the server
const port = process.env.node_port || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
