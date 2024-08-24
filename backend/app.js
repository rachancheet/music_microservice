const cors = require('cors');
const express = require('express');
const multer = require('multer');
const {createClient} = require("redis");
// const path = require('node:path'); 

const client = createClient();
(async () => {

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  // await client.set("key", "value");
  console.log("Redis Connected!")
  // const value = await client.get("que1");
  // console.log(value);
})();
// console.log("hey")

const app = express();

function removeNonAlphabetic(str) {
  return str.replace(/[^a-zA-Z0-9.]/g, '');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/imgs/');
  },
  filename: function (req, file, cb) {
    // Set filename to req.body.group + original file extension
    const filename = removeNonAlphabetic(req.body.group) + "_" + removeNonAlphabetic(file.originalname)
    cb(null, filename);
  }
});




const upload = multer({storage:storage});
// Middleware to parse form data
app.use(cors());

app.post("/",upload.single('img'), (req, res) => {
    console.log("arrived");
    console.log("Form data:", req.body);

    const filename = req.file.filename
    console.log("Filename: ",filename)
    client.LPUSH("music_que_1",filename)
    console.log("LPUSHED")
    res.send("Done");
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
