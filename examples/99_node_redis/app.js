const express = require('express')
const redis = require('redis')
const { promisify } = require('util')

const app = express()

const REDIS_HOST = process.env.REDIS_HOST || redis
const PORT = process.env.PORT || 3000

const client = redis.createClient({ host: REDIS_HOST })

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

app.get('/', (req, res) => {
  return res.send('Hello world')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// http://localhost:3000/store/key1?name=levi
app.get('/store/:key', async (req, res) => {
  const { key } = req.params
  const value = req.query

  await setAsync(key, JSON.stringify(value))
  return res.send('Success')
})

// http://localhost:3000/key2
app.get('/:key', async (req, res) => {
  const { key } = req.params

  const rawData = await getAsync(key)
  return res.json(JSON.parse(rawData))
})
