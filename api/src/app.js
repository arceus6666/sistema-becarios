const join = require('path').join
const express = require('express')
const cors = require('cors')

const tareasRoute = require(join(__dirname, '../routes/tareas'))
const becariosRoute = require(join(__dirname, '../routes/becarios'))

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/tareas', tareasRoute)
app.use('/becarios', becariosRoute)

app.get('/', (req, res) => {
  res.status(204).send()
})

module.exports = app
