const Sequelize = require('sequelize')
const sequelize = require('../connect.js')
const Subject = require('./Subject.js')
const Theme = require('./Theme')
const Material = sequelize.define('material', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    name: {
        type: Sequelize.STRING
    },
    text:{
        type: Sequelize.STRING
    },
    description:{
        type: Sequelize.STRING
    },
    grade: {
        type: Sequelize.INTEGER
    },
    subject_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Subject,
            key: 'id'
        }
    },
    theme_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Theme,
            key: 'id'
        }
    },
    isPremium: {
        type: Sequelize.BOOLEAN
    },
    urlVideo: {
        type: Sequelize.STRING
    }
})

Material.hasOne(Theme)

module.exports = Material