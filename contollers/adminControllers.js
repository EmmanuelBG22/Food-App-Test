const User = require('../model/User')
const Order = require('../model/Order')
const Menu = require('../model/Menu')
const jwt = require('jsonwebtoken')
const { checkUser } = require('../middleware/auth')
const xlsx = require('xlsx')

//handle errors

const handleErrors = (e) => {
    console.log(e.message, e.code);
    let errors = { email: '', password: '', roles:''}

    //incorrect email
    if(e.message === 'incorrect email'){
        errors.email = 'your email is not registered'
    }

    if(e.message === 'incorrect password'){
        errors.password = 'your password is not correct'
    }

    //unique error code
    if(e.code===11000){
        errors.email = 'email already registered'
        return errors
    }

    if(e.code === 401){
        errors.roles = 'Admin requires a unique password'
        return errors
    }

    //validation errors
    if(e.message.includes('user validation failed'))
    Object.values(e.errors).forEach(({properties}) =>{
        errors[properties.path] = properties.message;
    })
    return errors
}



//create token

const maxAge = 3 * 24 * 60 * 60 //this ex-pects a time in seconds and not milliseconds

const createToken = (id) => {
    return jwt.sign({id}, 'imbarinbeistehboythatputmoneyinbabriga', {
        expiresIn: maxAge
    });
}

module.exports.admin_post = async (req, res) =>{
        //creating a new order every time input is made on client side
    console.log(req.body)
    const menu = new Menu({
        ...req.body,
        owner: req.body.name
    })
    console.log()

    try{
        await menu.save()
        res.status(201).json({ menu })
    }catch(e){
        res.status(400).send(e)
    }
}


module.exports.make_order_get = (req, res) => {
    res.render('make-order')
}



module.exports.login_get = (req, res) =>{
    res.render('login');
}

module.exports.signup_post = async (req, res) =>{
    const {email, password, name, roles} = req.body
    console.log(req.body.roles)

    try{
        if(req.body.roles==="Admin" && req.body.password !== 'olayiwola12'){
            const errMsg = 'Admin Password Needed'
            return res.status(401).json({message: errMsg})
        }
       const user = await User.create({email, password, name, roles});
       const token = createToken(user._id)
       res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
       res.status(201).json({user: user._id, roles: user.roles})
    }catch(e){
        const errors = handleErrors(e)
        res.status(400).json({errors})
    }
}

module.exports.login_post = async (req, res) =>{
    const {email, password} = req.body

    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id})
    }catch(e){
        const errors = handleErrors(e)
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1 })
    res.redirect('/');
}

module.exports.make_order_get = (req, res) => {
    res.render('make-order')
}

module.exports.make_order_post = async (req, res) => {
    
    //creating a new order every time input is made on client side
    const order = new Order({
        ...req.body,
        owner: req.body.id
    })

    try{
        await order.save()
        res.status(201).json({ order })
    }catch(e){
        res.status(400).send(e)
    }
}


module.exports.get_menu = async (req, res) => {
    
    const menu = await Menu.find({})

    try{
        let menuItems = []
        menu.forEach(item =>{
            menuItems.push(item.restaurant)
        })

        res.status(200).json(menu)
        req.menu = menu
        res.locals.menu = menu
    }catch(e){
        res.status(400).send(e)
    }
}



module.exports.edit_admin = async (req, res)=>{
    let id = req.body.id
    console.log(req.body)
    let newRestaurant = req.body.restaurant
    let newDescription = req.body.description
    let newPrice = req.body.price
    console.log(req.body)
    try{

        const menu = await Menu.findOneAndUpdate({ "_id": id }, { "$set": { "restaurant": newRestaurant, "description": newDescription, "price": newPrice}})
        console.log(menu)
    }catch(e){
        console.log(e)
    }

}

module.exports.delete_menu = async (req, res) => {
    let id = req.body.id

    try{
        const menu = await Menu.findOneAndDelete({_id:id})
        console.log(menu)
    }catch(e){
        console.log(e)
    }
}

module.exports.delete_admin = async (req, res) => {
    let id = req.body.id
    console.log(req.body)

    try{
        const menu = await Menu.deleteMany({owner: id})
        console.log(menu)
    }catch(e){
        console.log(e)
    }
}

module.exports.orders_get = async (req, res) => {
    try{
        const order = await Order.find({})
        res.status(201).json({order})
    }catch(e){
        res.status(400).send(e)
    }
}
