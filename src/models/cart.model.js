const { Schema, model } = require('mongoose')

const CartSchema = new Schema({
    cart_userId:{type:String, require:true, ref:'user'},
    cart_products:{type:Array, default:[]},
    cart_count_products:{type:Number, default:0}
},{
    timestamps:true,
    collection:'cart'
})

module.exports = model('cart', CartSchema)