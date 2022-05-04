const Order = require('../model/Order')
const Menu = require('../model/Menu')
const jwt = require('jsonwebtoken')
const xlsx = require('xlsx')
const path = require('path')


module.exports.menu_post = async (req, res) =>{
        //creating a new order every time input is made on client side
    console.log(req.body)
    const menu = new Menu({
        ...req.body,
        owner: req.body.name
    })
    console.log()

    try{
        await menu.save()
        res.status(201).json({ menu })
    }catch(e){
        res.status(400).send(e)
    }
}


module.exports.get_menu = async (req, res) => {
    
    const menu = await Menu.find({})

    try{
        let menuItems = []
        menu.forEach(item =>{
            menuItems.push(item.restaurant)
        })

        res.status(200).json(menu)
        req.menu = menu
        res.locals.menu = menu
    }catch(e){
        res.status(400).send(e)
    }
}


module.exports.edit_menu = async (req, res)=>{
    let id = req.body.id
    console.log(req.body)
    let newRestaurant = req.body.restaurant
    let newDescription = req.body.description
    let newPrice = req.body.price
    console.log(req.body)
    try{

        const menu = await Menu.findOneAndUpdate({ "_id": id }, { "$set": { "restaurant": newRestaurant, "description": newDescription, "price": newPrice}})
        console.log(menu)
    }catch(e){
        console.log(e)
    }

}

module.exports.delete_menu = async (req, res) => {
    let id = req.body.id

    try{
        const menu = await Menu.findOneAndDelete({_id:id})
        console.log(menu)
    }catch(e){
        console.log(e)
    }
}

module.exports.delete_menus = async (req, res) => {
    let id = req.body.id
    console.log(req.body)

    try{
        const menu = await Menu.deleteMany({owner: id})
        console.log(menu)
    }catch(e){
        console.log(e)
    }
}

module.exports.orders_get = async (req, res) => {
    try{
        const order = await Order.find({})
        res.status(201).json({order})
    }catch(e){
        res.status(400).send(e)
    }
}



module.exports.download_order = async (req, res) => {
    try{
        var wb = xlsx.utils.book_new();
  var data = Order.find({}).select('rice')
  Order.find((err, data)=>{
    if(err){
      console.log(err)
    }else{
      var temp = JSON.stringify(data);
      temp = JSON.parse(temp);
      var ws = xlsx.utils.json_to_sheet(temp);
      var down = path.join(__dirname, '../public/export.xlsx')
      xlsx.utils.book_append_sheet(wb, ws, 'order');
      xlsx.writeFile(wb, down);
      res.download(down)
    }
  }).select('drink food restaurant owner -_id')
    }catch(e){
        console.log(e)
    }
}
