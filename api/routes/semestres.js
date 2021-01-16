const join = require('path').join
const express = require('express')
const ctrl = require(join(__dirname, '../controllers/semestre'))

const route = express.Router()

route.post('/add', ctrl.create)
route.delete('/delete/:id', ctrl.removeById)
route.get('/find/:id', ctrl.getById)
route.get('/all', ctrl.getAll)

module.exports = route
