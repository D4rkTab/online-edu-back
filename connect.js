const Sequelize = require('sequelize')

module.exports = new Sequelize('mathbook', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
})  