const mongoose =require('mongoose')


const orderSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true
    }
}, {
    timestamps: true
})


const Order = mongoose.model('Order', orderSchema)



module.exports = Order