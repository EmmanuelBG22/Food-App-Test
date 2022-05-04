const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser, authRole} = require('./middleware/auth')
const xlsx = require('xlsx')
const path = require('path');
const Order = require('./model/Order');

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
app.get('/make-order', requireAuth, (req, res)=> res.render('make-order'))
app.get('/edit-order', requireAuth, (req, res)=>{res.render('edit-order')})
app.get('/create-menu', requireAuth, authRole, (req, res)=>{res.render('create-menu')})
app.get('/edit-menu', requireAuth, authRole, (req, res)=>{res.render('edit-menu')})
// app.get('/see-orders', requireAuth, authRole, (req, res)=>{res.render('see-orders')})
app.get('/admin-home', requireAuth, authRole, (req, res) => res.render('admin-home'))
// app.get('/test', (req, res)=>res.render('test'))
app.get('/export', requireAuth, authRole, (req, res)=>res.download(down))


// data display
app.get('/see-orders', requireAuth, authRole, (req, res)=>{
  Order.find((err, data)=>{
    if(err){
      console.log(err)
    }else{
      if(data !=''){
        res.render('see-orders', {data});
      }else{
        res.render('see-orders', (data=''))
      }
    }
  })
})


//registering the routers in app
app.use(authRoutes)
app.use(adminRoutes)


app.listen(3003, ()=>{
  console.log('server is tunning on port 3003...')
})

module.exports = app