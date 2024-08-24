const redis = require("redis");
const { Worker } = require("node:worker_threads");
// const { REPL_MODE_SLOPPY } = require("repl");

// import { Client } from "pg";
// const { Client } = require("pg");
// var conString = "postgres://postgres:2206@localhost:5432/yub";

// const pgclient = new Client(conString);
// pgclient.connect();

//npx http-server -o /path/to/static/content

async function dothething(link) {
  // link = "https://www.youtube.com/watch?v=MFbWt4HJ5vQ";
  // group_id = "tey2134";
  // let { link, group_id } = JSON.parse(req.body);

  let group_id = link.slice(0, link.indexOf(":"));
  let song_ids = link.slice(link.indexOf(":") + 1).split(",");

  let len = song_ids.length;
  let aggre = [];
  for (let i = 0; i < 3; i++) {
    aggre.push(song_ids.slice((i * len) / 3, ((i + 1) * len) / 3));
  }
  console.log("aggregrate list: ", aggre);
  // return;

  let workers = [];
  let cnt = 0;

  let work1 = new Worker("./download_worker.js");
  work1.postMessage({ group_id, songs: aggre[0] });
  workers.push(work1);
  cnt++;
  // return;

  let work2 = new Worker("./download_worker.js");
  work1.postMessage({ group_id, songs: aggre[1] });
  workers.push(work2);
  cnt++;

  let work3 = new Worker("./download_worker.js");
  work1.postMessage({ group_id, songs: aggre[2] });
  workers.push(work3);
  cnt++;

  console.log("workers: ", workers);
  workers.forEach((work) => {
    work.on("message", (status) => {
      if (status == 1) {
        cnt--;
      } else {
        //handle errors;
      }

      if (cnt <= 0) {
        console.log("Downloading Done");
        return;
      }
    });
  });
}

async function main() {
  const client = redis.createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  console.log("Redis Connected!");
  while (1) {
    let resp = await client.brPop("music_que_2", 100000);
    console.log("resp: ", resp);
    resp = resp.element;
    // let group_id = resp.slice(0,resp.find(":"))
    await dothething(resp);
  }
}
main();
