const jwt = require('jsonwebtoken')
const User = require('../model/User')

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

module.exports = {
    requireAuth,
    checkUser
}