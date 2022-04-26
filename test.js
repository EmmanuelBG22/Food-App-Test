const Order = require('./model/Order')
const app = require('./app')



app.get('/rests', async (req, res)=>{
    const order = await Order.find({owner: '626440893b687346c0f415db'})
    res.send(order)
})

app.get('/resting', async (req, res)=>{
    const order = await Order.findOneAndUpdate({_id: "6266f7b93c73157df06b942b"}, {description: "Let us watch telemundo"})
    order.save()
})
