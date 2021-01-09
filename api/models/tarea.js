const mongoose = require('mongoose')

const Schema = mongoose.Schema

var tareaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bdate: {
    type: String,
    required: true,
  },
  edate: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    default: 0,
  },
  becarios: {
    type: [String],
    default: [],
  },
  finished: {
    type: Boolean,
    default: false,
  },
  semester: {
    type: String,
    required: true
  }
})

var Tarea = mongoose.model('Tarea', tareaSchema)

module.exports = Tarea
