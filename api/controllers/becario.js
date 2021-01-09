const join = require('path').join
const Becario = require(join(__dirname, '../models/becario'))

const create = async (req, res) => {
  let becario = await new Becario({
    name: req.body.name,
    semester: req.body.semester,
  })

  await becario.save().then(b => {
    res.status(201).json(b)
  }, err => {
    res.status(500).json(err)
  })
}

const update = (req, res) => {
  Becario.findOne({ _id: req.params.id }, async (err, becario) => {
    if (err) return res.status(500).json(err)
    if (!becario) return res.status(404).json(null)
    becario.thours = await req.body.thours
    becario.tareas = await req.body.tareas
    await becario.save().then(b => {
      res.status(200).json(b)
    }, err => {
      res.status(500).json(err)
    })
  })
}

const getById = (req, res) => {
  Becario.findOne({ _id: req.params.id }, (err, becario) => {
    if (err) return res.status(500).json(err)
    if (!becario) return res.status(404).json(null)
    res.status(200).json(becario)
  })
}

const getAll = (req, res) => {
  Becario.find({}, (err, becarios) => {
    if (err) return res.status(500).json(err)
    if (!becarios) return res.status(404).json(null)
    res.status(200).json(becarios)
  })
}

module.exports = {
  create,
  update,
  getById,
  getAll
}
