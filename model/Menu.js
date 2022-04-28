const mongoose =require('mongoose')


const menuSchema = new mongoose.Schema({
    restaurant:{
        type: String,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    price:{
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true
    }
}, {
    timestamps: true
})


const Menu = mongoose.model('Menu', menuSchema)



module.exports = Menu