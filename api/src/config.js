module.exports = {
  port: process.env.PORT || 7890,
  // db: process.env.MONGODB_URI || 'mongodb://sbellott15:gatachi123@127.0.0.1:27017/sbellott15?authSource=sbellott15',
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/becarios',
  SECRET_TOKEN: 'token'
}

