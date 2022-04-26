const User = require('../model/User')
const Order = require('../model/Order')
const jwt = require('jsonwebtoken')
const { checkUser } = require('../middleware/auth')
const request = require('request')

//handle errors

const handleErrors = (e) => {
    console.log(e.message, e.code);
    let errors = { email: '', password: ''}

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

module.exports.signup_get = (req, res) =>{
    res.render('signup');
}

module.exports.login_get = (req, res) =>{
    res.render('login');
}

module.exports.signup_post = async (req, res) =>{
    const {email, password, name} = req.body

    try{
       const user = await User.create({email, password, name});
       const token = createToken(user._id)
       res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
       res.status(201).json({user: user._id})
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


module.exports.get_orders = async (req, res) => {
    const id = req.user._id
    const order = await Order.find({owner: id})

    try{
        let meal = []
        order.forEach(ord =>{
            meal.push(ord.description)
        })

        res.status(200).json(order)
        console.log(meal)
        req.order = order
        res.locals.order = order
    }catch(e){
        res.status(400).send(e)
    }
}