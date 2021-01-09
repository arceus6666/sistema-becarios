const join = require('path').join
const Tarea = require(join(__dirname, '../models/tarea'))

const create = async (req, res) => {
  let tarea = await new Tarea({
    name: req.body.name,
    bdate: req.body.bdate,
    edate: req.body.edate,
    hours: req.body.hours,
  })

  await tarea.save().then(b => {
    res.status(201).json(b)
  }, err => {
    res.status(500).json(err)
  })
}

const update = (req, res) => {
  Tarea.findOne({ _id: req.params.id }, async (err, tarea) => {
    if (err) return res.status(500).json(err)
    if (!tarea) return res.status(404).json(null)
    tarea.becarios = await req.body.becarios
    tarea.finished = await req.body.finished
    await tarea.save().then(b => {
      res.status(200).json(b)
    }, err => {
      res.status(500).json(err)
    })
  })
}

const getById = (req, res) => {
  Tarea.findOne({ _id: req.params.id }, (err, tarea) => {
    if (err) return res.status(500).json(err)
    if (!tarea) return res.status(404).json(null)
    res.status(200).json(tarea)
  })
}

const getAll = (req, res) => {
  Tarea.find({}, (err, tareas) => {
    if (err) return res.status(500).json(err)
    if (!tareas) return res.status(404).json(null)
    res.status(200).json(tareas)
  })
}

module.exports = {
  create,
  update,
  getById,
  getAll
}
