import { getStaticFile, throwIfMissing } from "./utils.js"

export default async ({ req, res }) => {
  throwIfMissing(process.env, ["RAPIDAPI_KEY"])

  if (req.method === "GET") {
    return res.send(getStaticFile("index.html"), 200, {
      "Content-Type": "text/html; charset=utf-8"
    })
  }

  try {
    throwIfMissing(req.body, ["videoid"])
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400)
  }

  const youtubedl = require("youtube-dl-exec")

  youtubedl("https://www.youtube.com/watch?v=6xKWiCMKKJg", {
    dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ["referer:youtube.com", "user-agent:googlebot"]
  })
    .then((output) => {
      console.log(output)
      return res.json({ ok: true, completion: output.toString() }, 200)
    })
    .catch((err) => {
      console.log(err)
      return res.json({ ok: false, error: err.toString() }, 500)
    })

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