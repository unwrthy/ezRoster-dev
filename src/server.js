const Express = require('express')
const bodyParser = require('body-parser')
const createShortUrlsFactory = require('./createShortUrls')
const slashCommandFactory = require('./slashCommand')
require('dotenv').load()
const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const {SLACK_TOKEN: slackToken, REBRANDLY_APIKEY: apiKey, PORT} = process.env
console.log('TOKEN:'+slackToken + ' api: '+ apiKey)
if (!slackToken || !apiKey) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY')
  process.exit(1)
}

const port = PORT || 80

const rebrandlyClient = createShortUrlsFactory(apiKey)
const slashCommand = slashCommandFactory(rebrandlyClient, slackToken)

app.post('/', (req, res) => {
  slashCommand(req.body)
    .then((result) => {
      return res.json(result)
    })
    .catch(console.error)
})

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})
