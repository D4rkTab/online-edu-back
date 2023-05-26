const Sequelize = require('sequelize')
const sequelize = require('../connect.js')
const Role = require('./Role')
const User = sequelize.define('user', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    username: {
        type: Sequelize.STRING(30)
    },
    avatarUrl: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING(30)
    },
    password: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.INTEGER,
        refernces: {
            model: Role,
            key: 'id'
        }

    }
})

User.hasMany(Role)

module.exports = User