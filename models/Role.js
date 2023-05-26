const Sequelize = require('sequelize')
const sequelize = require('../connect.js')

const Role = sequelize.define('role', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    name: {
        type: Sequelize.STRING(15)
    }
})
module.exports = Role