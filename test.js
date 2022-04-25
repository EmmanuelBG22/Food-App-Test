const Order = require('./model/Order')
const app = require('./app')



app.get('/rest', async (req, res)=>{
    const order = await Order.find({owner: '626440893b687346c0f415db'})
    res.send(order)
})