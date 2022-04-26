const jwt = require('jsonwebtoken')
const User = require('../model/User')
const Order = require('../model/Order');


const requireAuth = (req, res, next) =>{

    const token = req.cookies.jwt;

    //check if webtoken exists
    if(!token){
        return res.redirect('/login')
    }
    jwt.verify(token, "imbarinbeistehboythatputmoneyinbabriga", (err, decodedToken)=>{
        if(err){
            console.log(err.message)
            return res.redirect('/login')
        }
        // console.log(decodedToken)
        next()
    })

}


//check current user

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, "imbarinbeistehboythatputmoneyinbabriga", async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                req.locals.user = null
                next()
            }
            // console.log(decodedToken);
            let user = await User.findOne({_id: decodedToken.id});
            // console.log(user)
            req.user = user
            res.locals.user = user
            next()
        })
    }else{
        res.locals.user = null;
        next()
    }
}

const checkOrder = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, "imbarinbeistehboythatputmoneyinbabriga", async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                req.locals.user = null
                next()
            }
            // console.log(decodedToken);
            // let user = await User.findOne({_id: decodedToken.id});
            let order = await Order.find({owner: decodedToken.id});
            // console.log(user)
            let contain = []
            req.order = order.forEach(ord => contain.push(ord.description + ':' + ord._id))
            console.log(contain)
            res.locals.order = contain
            next()
        })
    }
}

module.exports = {
    requireAuth,
    checkUser,
    checkOrder
}