import axios from "axios"
import fs from "fs"
import youtubedl from "youtube-dl-exec"
import ytdl from "ytdl-core"

import { getStaticFile, throwIfMissing } from "./utils.js"

export default async (context) => {
  const { req, res } = context
  // throwIfMissing(process.env, ["RAPIDAPI_KEY"])

  if (req.method === "GET") {
    return res.send(getStaticFile("index.html"), 200, {
      "Content-Type": "text/html; charset=utf-8"
    })
  }

  // try {
  //   throwIfMissing(req.body, ["videoid"])
  // } catch (err) {
  //   return res.json({ ok: false, error: err.message }, 400)
  // }

  try {
    context.log(req.body.videoid)
    // let info = await ytdl.getBasicInfo(req.body.videoid)

    const options = {
      method: "GET",
      url: "https://get-youtube-video-revision-graph.p.rapidapi.com/getHeatMarkers",
      params: {
        videoId: videoid
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "get-youtube-video-revision-graph.p.rapidapi.com"
      }
    }

    try {
      const response = await axios.request(options)
      context.log(response.data)
    } catch (error) {
      context.error(error)
    }

    // let out = await youtubedl("https://www.youtube.com/watch?v=6xKWiCMKKJg", {
    //   dumpSingleJson: true,
    //   noCheckCertificates: true,
    //   noWarnings: true,
    //   preferFreeFormats: true,
    //   addHeader: ["referer:youtube.com", "user-agent:googlebot"]
    // })
    return res.json({ ok: false, error: "Failed to download video" }, 200)
  } catch (err) {
    context.log(err)
    return res.json({ ok: false, error: err.message }, 400)
  }
}
