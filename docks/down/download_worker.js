const fs = require("fs");
const path = require("path");
const { parentPort } = require("node:worker_threads");
const youtubedl = require("youtube-dl-exec");

parentPort.on("message", ({ group_id, songs }) => {
  console.log("minor ready", group_id, songs);
  songs.forEach((song_id) => {
    let folderPath = path.join(process.env.song_dir, group_id);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    folderPath = path.join(folderPath, song_id);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    console.log("downloading : ", song_id, "to ", folderPath);
    downloadYouTubeAudio(song_id, folderPath);
  });
});

async function downloadYouTubeAudio(song_id, folderPath) {
  // try {
  videoUrl = "https://www.youtube.com/watch?v=" + song_id;
  console.log("Fetching video information...");
  const info = await youtubedl(videoUrl, {
    dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ["referer:youtube.com", "user-agent:googlebot"],
  });
  filename = info.fulltitle;
  console.log("Video title:", filename);
  // return;
  console.log("Downloading and converting to MP3...");
  await youtubedl(videoUrl, {
    extractAudio: true,
    audioFormat: "mp3",
    audioQuality: 0,
    output: folderPath + `/${filename}.%(ext)s`,
    noCheckCertificates: true,
    addHeader: ["referer:youtube.com", "user-agent:googlebot"],
  });

  // Check if the file was downloaded successfully
  if (fs.existsSync(folderPath + `/${filename}.mp3`)) {
    console.log(
      `Audio downloaded and saved as ${folderPath + "/" + filename}.mp3`
    );
  } else {
    console.error("Failed to download the audio.");
  }
  // } catch (error) {
  //   console.error("An error occurred:", error);
  // }
}
