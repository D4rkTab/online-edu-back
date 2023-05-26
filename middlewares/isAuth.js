const {User, Role} = require('../models')
const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next) => {
    const {token} = req.body
    if(!token){
        res.json({'message': 'User is not authenticated.'})
    }else{
        const isCorrect = jwt.verify(token, process.env.SECRET_JWT_KEY)
        if(isCorrect){
            next()
        }
        else{
            res.json({'message': 'Wrong token.'})
        }
    }
}

module.exports = isAuth