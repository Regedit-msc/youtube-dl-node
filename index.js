// Require The Necessary modules

const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
const path = require("path"); // reqires path for routing

// Use public folder for static files
app.use(express.static("public"));

// Set port .env
let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}
// Start the server
app.listen(port, () => {
  console.log("App listening...");
});

app.get("/", (req, res) => {
  // called when request to / comes in
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.use(cors());

// Get the url from the request validate with ytdl , get the file info and add the filename.mp3 as an header
app.get("/downloadmp3", async (req, res, next) => {
  try {
    var url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.sendStatus(400);
    }
    let title = "audio";

    await ytdl.getBasicInfo(
      url,
      {
        format: "mp4",
      },
      (err, info) => {
        if (err) throw err;
        title = info.player_response.videoDetails.title.replace(
          /[^\x00-\x7F]/g,
          ""
        );
      }
    );

    res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
    ytdl(url, {
      format: "mp3",
      filter: "audioonly",
    }).pipe(res);
  } catch (err) {
    console.error(err);
  }
});
// What to do when request is made to /downloadmp4 same as above
app.get("/downloadmp4", async (req, res, next) => {
  try {
    let url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.sendStatus(400);
    }
    let title = "video";

    await ytdl.getBasicInfo(
      url,
      {
        format: "mp4",
      },
      (err, info) => {
        title = info.player_response.videoDetails.title.replace(
          /[^\x00-\x7F]/g,
          ""
        );
      }
    );

    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    ytdl(url, {
      format: "mp4",
    }).pipe(res);
  } catch (err) {
    console.error(err);
  }
});
