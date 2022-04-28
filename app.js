const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser, authRole} = require('./middleware/auth')
const request = require('request')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://127.0.0.1:27017/food-manager-api';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})


// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.get('/make-order', requireAuth, (req, res)=> res.render('make-order'))
app.get('/edit-order', requireAuth, (req, res)=>{res.render('edit-order')})
app.get('/admin', requireAuth, checkUser, authRole, (req, res)=>{res.render('admin')})
app.get('/edit-admin', requireAuth, authRole, (req, res)=>{res.render('edit-admin')})


//registering the routers in app
app.use(authRoutes)
app.use(adminRoutes)


app.listen(3003, ()=>{
  console.log('server is tunning on port 3003...')
})

module.exports = app