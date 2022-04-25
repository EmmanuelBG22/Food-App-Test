const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/auth')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://127.0.0.1:27017/food-manager-api';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})


// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.get('/make-order', requireAuth, checkUser, (req, res)=> res.render('make-order'))
// app.get('/get-orders', requireAuth, (req, res)=>{
//   res.render('get-orders', {
//     boys: 'imbarinbe'
//   })
// })



//registering the routers in app
app.use(authRoutes)


// //cookies
// app.get('/set-cookies', (req, res)=>{

//   // res.setHeader('Set-Cookie', 'newUser=true')

//   res.cookie('newUser', false, { 
//     maxAge: 1000 * 60 * 60 * 24, httpOnly: true
//   })
//   res.send('you got the cookies!')

// })

// app.get('/read-cookies', (req, res)=>{

//   const cookies = req.cookies;
//   console.log(cookies.newUser)

//   res.json(cookies)
// })

app.listen(3003, ()=>{
  console.log('server is tunning on port 3003...')
})

module.exports = app