const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    order_userId:{type:Number, require:true},
    order_checkout:{type:Object, default:{}},
    /*
        order_checkout:{
            totalPayment,
            totalApplyDiscount,
            feeShip
        } 
    */
    order_shipping:{type:Object, default:{}},
    /*
        street,
        city,
        state,
        country
    */
    order_payment:{type:Object, default:{}},
    order_products:{type:Array, require:true},
    order_trackingNumber:{type:String, default:'#000112234'},
    order_status:{type:String, enum:['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default:'pending'}
},{
    timestamps:true,
    collection:'order'
})

module.exports = mongoose.model('order', OrderSchema)
