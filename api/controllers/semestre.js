const join = require('path').join
const Semestre = require(join(__dirname, '../models/semestre'))

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
  Semestre.findByIdAndDelete(req.params.id).then(semestre => {
    if (!semestre) return res.status(404).json(null);
    res.status(200).json(semestre);
  }, err => {
    res.status(500).json(err);
  });
}

module.exports = {
  create,
  getById,
  getAll,
  removeById
}
