const mongoose = require('mongoose')

const Schema = mongoose.Schema

var becarioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cumplidas: {
    type: Number,
    default: 0
  },
  asignadas: {
    type: Number,
    default: 0
  },
  semester: {
    type: String,
    required: true
  },
  tareas: {
    type: [String],
    default: []
  }
})

var Becario = mongoose.model('Becario', becarioSchema)

module.exports = Becario
