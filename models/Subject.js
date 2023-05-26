const Sequelize = require('sequelize')
const sequelize = require('../connect.js')
module.exports = sequelize.define('subject', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    name: {
        type: Sequelize.STRING(30)
    }
})