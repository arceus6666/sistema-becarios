const mongoose = require('mongoose')

const Schema = mongoose.Schema

var semestreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  }
})

var Semestre = mongoose.model('Semestre', semestreSchema)

module.exports = Semestre
