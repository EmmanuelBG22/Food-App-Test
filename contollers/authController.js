const User = require('../model/User')
const Order = require('../model/Order')
const jwt = require('jsonwebtoken')
const { checkUser } = require('../middleware/auth')
const request = require('request')

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

const maxAge = 12 * 60 * 60 //this ex-pects a time in seconds and not milliseconds

const createToken = (id) => {
    return jwt.sign({id}, 'imbarinbeistehboythatputmoneyinbabriga', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) =>{
    res.render('signup');
}

module.exports.login_get = (req, res) =>{
    res.render('login');
}

module.exports.signup_post = async (req, res) =>{
    const {email, password, name, roles} = req.body

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
        res.status(200).json({user: user._id, roles: user.roles})
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
        owner: req.body.name
    })

    try{
        await order.save()
        res.status(201).json({ order })
    }catch(e){
        res.status(400).send(e)
    }
}


module.exports.get_orders = async (req, res) => {
    const name = req.user.name
    console.log(req.user.name)
    const order = await Order.find({owner: name})

    try{
        let meal = []
        order.forEach(ord =>{
            meal.push(ord.restaurant, ord.food, ord.drink)
        })

        res.status(200).json(order)
        console.log(meal)
        req.order = order
        res.locals.order = order
    }catch(e){
        res.status(400).send(e)
    }
}



module.exports.edit_order = async (req, res)=>{
    let id = req.body.id
    let newDescription = req.body.description
    try{
        const filter = {_id: id}
        const update = {description: newDescription}
        const order = await Order.findOneAndUpdate(filter, update)
        res.status(200).json({order})
    }catch(e){
        console.log(e)
    }

}

module.exports.delete_order = async (req, res) => {
    let id = req.body.id

    try{
        const order = await Order.findOneAndDelete({_id:id})
        console.log(order)
    }catch(e){
        console.log(e)
    }
}