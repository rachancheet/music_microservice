const { exec } = require("child_process");
const { group } = require("console");

import { Client } from "pg";
var conString = "postgres://postgres:1234@localhost:5432/yub";

const pgclient = new Client(conString);
await pgclient.connect();

async function dothething() {
  //   while (1) {
  //     let data = await client.lpop(
  //       commandOptions({ isolated: true }),
  //       "queue",
  //       0
  //     );
  // if (data) {
  //   let { group_id, song_id, song_name } = JSON.parse(data);
  group_id = "tey2134";
  song_id = "MFbWt4HJ5vQ";
  song_name =
    "Badnam  Mankirt Aulakh Feat Dj Flow  Sukh Sanghera  Singga  Speed Records.mp3";
  let base = `${__dirname}/downs/${group_id}/${song_id}`;
  console.log(base);
  exec(
    `ffmpeg -i ${
      base + "/'" + song_name + "'"
    } -map 0:a -c:a aac -b:a 192k -ac 2 -f hls -hls_time 10 -preset ultrafast -flags -global_header ${base}/master.m3u8`,
    async (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }

      const res = await pgclient.query(`
      update yub_data set status='ready' where id='${song_id}'
      `);
    }
  );

  // );

  //   } else {
  //     console.log("error reading from redis");
  //   }
  // }
}
dothething();
