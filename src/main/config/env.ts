export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '05676d16-ebaf-42a8-9d99-606c90e7f781'
}
