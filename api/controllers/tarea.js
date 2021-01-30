const join = require('path').join
const Tarea = require(join(__dirname, '../models/tarea'))
const Becario = require(join(__dirname, '../models/becario'))

const create = async (req, res) => {
  let tarea = await new Tarea({
    name: req.body.name,
    bdate: req.body.bdate,
    edate: req.body.edate,
    hours: req.body.hours,
    semester: req.body.semester,
  })


  await tarea.save().then(b => {
    // console.log(b)
    res.status(201).json(b)
  }, err => {
    res.status(500).json(err)
  })
}

const update = (req, res) => {
  Tarea.findOne({ _id: req.params.id }, async (err, tarea) => {
    if (err) return res.status(500).json(err)
    if (!tarea) return res.status(404).json(null)
    if (req.body.semester !== tarea.semester) {
      await Becario.updateMany({}, { $pull: { tareas: req.params.id } })
      req.body.becarios = await [];
    }
    await tarea.set(req.body)
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

const removeById = (req, res) => {
  Tarea.findByIdAndDelete(req.params.id).then(async t => {
    if (!t) return res.status(404).json(null)
    await Becario.updateMany({}, { $pull: { tareas: req.params.id } })
    await res.status(200).json(t)
  }, err => {
    res.status(500).json(err)
  })
}

module.exports = {
  create,
  update,
  getById,
  getAll,
  removeById
}
