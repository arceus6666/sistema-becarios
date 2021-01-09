const config = require('./config')
const mongoose = require('mongoose')
const app = require('./app')

mongoose.set('useCreateIndex', true)

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if (err) {
    return console.log(`Hubo un error al inicializar:\n ${err}.`)
  } else {
    console.log('Conexion a DB establecida.')
    app.listen(config.port, () => {
      console.log(`Api ejecutandose desde el puerto ${config.port}.`)
    })
  }
})
