const express = require('express')
const path = require('path')

const PORT = 3000

const app = express()
app.use(express.json())
app.use(express.text())
app.use(express.static('dist'))

app.use('*', (_, res) => {
  const indexFilePath = path.resolve(process.cwd(), 'dist/index.html')
  res.sendFile(indexFilePath)
})

app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`)
})
