const express = require('express')
const app = express()
const cors = require('cors')
const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors())
require('./routes/websocket')
require('dotenv').config();

app.use('/api/v1', require('./routes/api'))

// подключение к бд
app.listen(process.env.PORT || 3000, () => {
    console.log("works")
})
