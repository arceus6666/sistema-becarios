module.exports = {
  port: process.env.PORT || 7890,
  // db: process.env.MONGODB_URI || 'mongodb://sbellot15:s3rg10b3ll0t@127.0.0.1:27017/sbellot15?authSource=sbellot15',
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/becarios',
  SECRET_TOKEN: 'token'
}

