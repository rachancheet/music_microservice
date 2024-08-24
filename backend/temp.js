const youtubedl = require("youtube-dl-exec");
const fs = require("fs");

async function downloadYouTubeAudio(videoUrl, outputFileName) {
  try {
    console.log("Fetching video information...");
    const info = await youtubedl(videoUrl, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });
    console.log("Video title:", info.fulltitle);
    filename = info.fulltitle;
    // return;
    console.log("Downloading and converting to MP3...");
    await youtubedl(videoUrl, {
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0,
      output: `${filename}.%(ext)s`,
      noCheckCertificates: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    // Check if the file was downloaded successfully
    if (fs.existsSync(`${filename}.mp3`)) {
      console.log(`Audio downloaded and saved as ${outputFileName}.mp3`);
    } else {
      console.error("Failed to download the audio.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Usage
const videoUrl = "https://www.youtube.com/watch?v=bATa4Gybpg8"; // Replace with your YouTube video URL
// const outputFileName = "output"; // The name you want to give to the output file (without extension)

downloadYouTubeAudio(videoUrl);
