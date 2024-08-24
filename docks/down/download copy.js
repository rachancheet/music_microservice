const redis = require("redis");
const fs = require("fs");


var YoutubeMp3Downloader = require("youtube-mp3-downloader");

// import { Client } from "pg";
// const { Client } = require("pg");
// var conString = "postgres://postgres:2206@localhost:5432/yub";

// const pgclient = new Client(conString);
// pgclient.connect();

//npx http-server -o /path/to/static/content

async function dothething(s) {
  
  
  // link = "https://www.youtube.com/watch?v=MFbWt4HJ5vQ";
  // group_id = "tey2134";
  // let { link, group_id } = JSON.parse(req.body);

  let group_id = link.slice(0,link.indexOf(":"));
  let song_id = link.slice(link.indexOf(":") + 1);

  let folderName = __dirname + "/downs/" + group_id + "/" + song_id;
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  let YD = new YoutubeMp3Downloader({
    // ffmpegPath: __dirname + "/down/ffmpeg", // FFmpeg binary location
    outputPath: folderName, // Output file location (default: the home directory)
    youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
    queueParallelism: 3, // Download parallelism (default: 1)
    progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
    allowWebm: true, // Enable download from WebM sources (default: false)
  });

  YD.on("finished", async function (err, data) {
    data = JSON.stringify(data);
    console.log("finished data ::", data);

    //postgres
    //group:list  songs , ids
    //reddis push data.tile
    try {
      client.lPush(
        "queue",
        JSON.stringify({
          group_id: group_id,
          song_id: song_id,
          song_name: data.title,
        })
      );

      const res = await pgclient.query(`
      insert into yub_data values(
        ${song_id},
        ${group_id},
        ${data.title},
        downloaded,
        )
      `);
    } catch (err) {
      console.error(err);
    }
  });

  YD.on("error", function (error) {
    console.log("AsdfsaFD", error);
  });

  YD.on("progress", function (progress) {
    console.log(JSON.stringify(progress));
  });
  YD.download(song_id);
}



async function main() {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  await client.set("key", "value");
  console.log("Redis Connected!")
  while(1){
    let resp = client.BRPOP("myque1");
    await dothething(resp)
  }
}
main();




// app.post("/", dothething);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// async function dothething() {
//   while (1) {
//     let data = await client.lpop(
//       commandOptions({ isolated: true }),
//       "queue",
//       0
//     );
//     if (data) {
//       let { link, group_id } = JSON.parse(data);
//       let id = link.slice(link.indexOf("v=") + 2);

//       let folderName = __dir + "/downs/" + group_id;
//       if (!fs.existsSync(folderName)) {
//         fs.mkdirSync(folderName);
//       }

//       let YD = new YoutubeMp3Downloader({
//         // ffmpegPath: __dirname + "/down/ffmpeg", // FFmpeg binary location
//         outputPath: folderName, // Output file location (default: the home directory)
//         youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
//         queueParallelism: 2, // Download parallelism (default: 1)
//         progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
//         allowWebm: true, // Enable download from WebM sources (default: false)
//       });

//       YD.on("finished", function (err, data) {
//         console.log("finished data ::", JSON.stringify(data));
//       });

//       YD.on("error", function (error) {
//         console.log("AsdfsaFD", error);
//       });

//       YD.on("progress", function (progress) {
//         console.log(JSON.stringify(progress));
//       });
//       YD.download(id);
//     } else {
//       console.log("error while pulling from reddis queue");
//     }
//   }
// }
// // dothething();
