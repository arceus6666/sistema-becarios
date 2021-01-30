const join = require('path').join
const express = require('express')
const ctrl = require(join(__dirname, '../controllers/becario'))

const route = express.Router()

route.post('/add', ctrl.create)
route.put('/update/:id', ctrl.update)
route.get('/find/:id', ctrl.getById)
route.get('/all', ctrl.getAll)
route.delete('/delete/:id', ctrl.removeById)

module.exports = route
