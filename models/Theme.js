const Sequelize = require('sequelize')
const sequelize = require('../connect.js')
const Subject = require('./Subject.js')
const Theme = sequelize.define('theme', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    name: {
        type: Sequelize.STRING(30)
    },
    grade: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.STRING
    },
    subject_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Subject,
            key: 'id'
        }
    }
})

Theme.hasOne(Subject)

module.exports = Theme