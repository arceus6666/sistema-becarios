const join = require('path').join
const Semestre = require(join(__dirname, '../models/semestre'))
const Tarea = require(join(__dirname, '../models/tarea'))
const Becario = require(join(__dirname, '../models/becario'))

const create = async (req, res) => {
  let semestre = await new Semestre({
    name: req.body.name,
  })

  await semestre.save().then(b => {
    res.status(201).json(b)
  }, err => {
    res.status(500).json(err)
  })
}

const update = (req, res) => {
  Semestre.findOne({ _id: req.params.id }, async (err, s) => {
    if (err) return res.status(500).json(err)
    if (!s) return res.status(404).json(null)
    await s.set(req.body)
    await s.save().then(b => {
      res.status(200).json(b)
    }, err => {
      res.status(500).json(err)
    })
  })
}

const getById = (req, res) => {
  Semestre.findOne({ _id: req.params.id }, (err, semestre) => {
    if (err) return res.status(500).json(err)
    if (!semestre) return res.status(404).json(null)
    res.status(200).json(semestre)
  })
}

const getAll = (req, res) => {
  Semestre.find({}, (err, semestres) => {
    if (err) return res.status(500).json(err)
    if (!semestres) return res.status(404).json(null)
    res.status(200).json(semestres)
  })
}

const removeById = (req, res) => {
  // console.log('deleting: ' + req.params.id)
  Semestre.findByIdAndDelete(req.params.id).then(async s => {
    if (!s) return res.status(404).json(null);
    await Tarea.deleteMany({ semester: req.params.id })
    await Becario.deleteMany({ semester: req.params.id })
    await res.status(200).json(s);
  }, err => {
    res.status(500).json(err);
  });
}

module.exports = {
  create,
  getById,
  getAll,
  removeById,
  update
}
