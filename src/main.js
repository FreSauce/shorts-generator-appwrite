import ytdl from "ytdl-core"

import { getStaticFile, throwIfMissing } from "./utils.js"

ytdl
  .getBasicInfo("https://www.youtube.com/watch?v=vrOjy-v5JgQ")
  .then((info) => {
    console.log(info)
  })

export default async (context) => {
  const { req, res } = context
  throwIfMissing(process.env, ["RAPIDAPI_KEY"])

  if (req.method === "GET") {
    return res.send(getStaticFile("index.html"), 200, {
      "Content-Type": "text/html; charset=utf-8"
    })
  }

  try {
    throwIfMissing(req.body, ["videourl"])
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400)
  }

  try {
    context.log(req.body.videourl)
    let info = await ytdl.getBasicInfo(req.body.videourl)
    context.log(info)
    return res.json({ ok: true, data: info }, 200)
  } catch (err) {
    context.log(err)
    return res.json({ ok: false, error: err.message }, 400)
  }
  // const openai = new OpenAIApi(
  //   new Configuration({
  //     apiKey: process.env.OPENAI_API_KEY
  //   })
  // )

  // try {
  //   const response = await openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //     max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS ?? "512"),
  //     messages: [{ role: "user", content: req.body.prompt }]
  //   })
  //   const completion = response.data.choices[0].message?.content
  //   return res.json({ ok: true, completion }, 200)
  // } catch (err) {
  //   return res.json({ ok: false, error: "Failed to query model." }, 500)
  // }
}
