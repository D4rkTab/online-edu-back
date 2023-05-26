const {Router} = require('express')
const router = Router()
const sequelize = require('../connect')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
/* 
API: материал, авторизация
    
-------------------------------------------------------
/api/v1/add_new_material (POST: subject, grade, data),|
/api/v1/get_current_material (GET: id),               |
/api/v1/get_grade_materials (GET: grade),             |
/api/v1/get_subject_materials (GET: subject),         |  МАТЕРИАЛ
/api/v1/get_materials(GET: subject, grade),           |
/api/v1/search-material(GET: hashtags)                |
/api/v1/delete_material (DELETE: id)                  |
/api/v1/update_material (PUT: id)                     |
-------------------------------------------------------

*/

const {Material, Subject, Theme, Role, User} = require('../models/')
const isAuth = require('../middlewares/isAuth')
router.post('/add_new_subject', isAuth, async (req,res) => {
    const {name, grade} = req.body
    const subject = await Subject.create({
        name: name,
        grade: grade
    })
    return res.json(subject)
    
});
router.post('/add_new_theme', isAuth, async (req,res) => {
    const {name, grade, subject_id} = req.body
    const theme = await Theme.create({
        name: name,
        grade: grade,
        subject_id: subject_id
    })
    return res.json(theme)
});
router.post('/add_new_material', isAuth, async (req,res) => {
    const {name, grade, subject_id, theme_id, isPremium, text, description} = req.body   
    if(!name){
        res.json({'message': 'You should enter name'}).status(500)
    }
    if(!grade){
        res.json({'message': 'You should enter grade'}).status(500)
    }
    if(!subject_id){
        res.json({'message': 'You should enter subject_id'}).status(500)
    }
    if(!theme_id){
        res.json({'message': 'You should enter theme_id'}).status(500)
    }
    if(!isPremium){
        res.json({'message': 'You should enter premium status'}).status(500)
    }
    if(!text){
        res.json({'message': 'You should enter text'}).status(500)
    }
    if(!description){
        res.json({'message': 'You should enter description'}).status(500)
    }
    const material = await Material.create({
        name: name,
        grade: grade,
        subject_id: subject_id,
        theme_id: theme_id,
        isPremium: isPremium,
        text: text,
        description: description
    })
    return res.json(material).status(200)
})
router.get('/get_current_material', async (req,res) => {
    const {id} = req.query
    if(!id){
        return res.json({'message': 'You should enter the id.'}).status(500)

    }
    const material = await Material.findByPk(id)
    if (material === null){
        return res.json({'message': 'Not found!'}).status(404)
    }
    const subject = await Subject.findByPk(material.subject_id)
    const theme = await Theme.findByPk(material.theme_id)
    return res.json({
        'material': material,
        'subject': subject,
        'theme': theme
    })
});
router.get('/get_grade_materials', async (req,res) => {
    const {grade} = req.body
    if(!grade){
        return res.json({'message': 'You should enter the grade.'}).status(500)
    }
    const materials = await Material.findAll({where: {grade: grade}})
    if (materials.length == 0){
        return res.json({'message': 'Not found!'}).status(404)
    }
    return res.json(materials)
});
router.get('/get_subject_materials', async (req,res) => {
    const {subject_id} = req.body
    if(!subject_id){
        return res.json({'message': 'You should enter the subject id.'}).status(500)
    }
    const materials = await Material.findAll({where: {subject_id: subject_id}})
    if(materials.length == 0){
        return res.json({'message': 'Not found!'}).status(404)
    }
    return res.json(materials)
});
router.get('/get_theme_materials', async (req,res) => {
    const {theme_id} = req.query
    if(!theme_id){
        return res.json({'message': 'You should enter the theme id.'}).status(500)
    }
    const materials = await Material.findAll({where: {theme_id: theme_id}})
    if(materials.length == 0){
        return res.json({'message': 'Not found!'}).status(404)
    }
    const theme = await Theme.findByPk(theme_id)
    const subject = await Subject.findByPk(materials[0].subject_id)
    return res.json({
        'materials': materials,
        'theme': theme,
        'subject': subject
    })
});

router.get('/get_materials', async (req, res) => {
    const materials = await Material.findAll()
    return res.json(materials)
});
router.get('/search-materials', async (req,res) => {
    const {grade, subject_id, theme_id} = req.query
    let where = {}
    if(grade){
        where['grade'] = grade
    }
    if(subject_id){
        where['subject_id'] = subject_id
    }
    if(theme_id){
        where['theme_id'] = theme_id

    }
    const materials = await Material.findAll({where: where})
    if (materials.length == 0){
        return res.json({'message': 'Not found!'}).status(404)
    }
    return res.json(materials)
});
router.delete('/delete-material', isAuth, async (req,res) => {
    const {id} = req.body
    if(!id){
        return res.json({'message': 'You should enter the id.'})
    }
    const material = await Material.findByPk(id)
    if(material === null){
        return res.json({'message': 'Wrong id!'})
    }
    material.destroy()
    return res.json({'message': 'Success!'})
});
router.put('/update-material',isAuth, async (req,res) => {
    const {id, name, text, grade, isPremium, subject_id, theme_id} = req.body
    if(!id){
        return res.json({'message': 'You should enter the id.'})
    }
    const material = await Material.findByPk(id)
    if(material === null){
        return res.json({'message': 'Wrong id!'})
    }
    if(name){
        material.name = name
    }
    if(text){
        material.text = text
    }
    if(grade){
        material.grade = grade
    }
    if(isPremium){
        material.isPremium = isPremium
    }
    if(subject_id){
        const subject = await Subject.findByPk(subject_id)
        if (subject === null){
            return res.json({'message': 'There isn`t such subject in database.'})
        }else{
            material.subject_id = subject_id
        }
    }
    if(theme_id){
        const theme = await Theme.findByPk(theme_id)
        if (theme === null){
            return res.json({'message': 'There isn`t such theme in database.'})
        }else{
            material.theme_id = theme_id
        }
    }
    await material.save()
    return res.json(material).status(200)
});

router.get('/get-themes', async (req,res) => {
    const {grade,subject_id} = req.query
    if(!grade){
        return res.json({'message': 'You should enter the grade.'})
    }
    if(!subject_id){
        return res.json({'message': 'You should enter the subject id.'})
    }
    const themes = await Theme.findAll({where: {
        subject_id: subject_id,
        grade: grade
    }})
    return res.json(themes)
})

router.get('/get_current_theme', async(req,res) =>{
    const {theme_id} = req.query
    if(!theme_id){
        return res.json({'message': 'You should enter the id.'})
    }
    const theme = await Theme.findByPk(theme_id)
    return res.json(theme)
})

router.post('/create-user', async(req,res) => {
    const {username, email, password} = req.body
    if(!username){
        return res.json({'message': 'You should enter username.'})
    }
    if(!email){
        return res.json({'message': 'You should enter email.'})
    }
    if(!password){
        return res.json({'message': 'You should enter password.'})
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const user = await User.create({
                username: username,
                email: email,
                password: hash
            })
            res.json(user)
        })
        
    })
})

router.post('/auth-user', async(req,res) => {
    const {username, password} = req.body
    if(!username){
        return res.json({'message': 'You should enter username.'})
    }
    if(!password){
        return res.json({'message': 'You should enter password.'})
    }
    const user = await User.findOne({where: {username: username}})
    if(!user){
        return res.json({'message': 'wrong username'})
    }
    const isPasswordRight = await bcrypt.compare(password, user.password)
    const secretKey = process.env.SECRET_JWT_KEY
    if(isPasswordRight){
        const token = jwt.sign({'user': user}, secretKey, {'expiresIn': '12h', algorithm:'HS256'})
        res.json({'token': token, 'username': username, 'avatar': user.avatarUrl})
    }else{
        res.json({'message': 'wrong pass.'})
    }
})

sequelize.sync() 
module.exports = router