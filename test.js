const Order = require('./model/Order')
const app = require('./app')



app.get('/rest', async (req, res)=>{
    const order = await Order.find({})
    console.log(order.Order)
})