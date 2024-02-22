const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InventorieSchema = new Schema({
    inventory_productId:{type:String, require:true, ref:'product'},
    inventory_location:{type:String, default:'unKnow'},
    inventory_stock:{type:Number, require:true},
    inventory_userId:{type:String, require:true, ref:'user'},
    inventory_reservations:{type:Array, default:[]}
},{
    timestamps:true,
    collection:'inventories'
})

module.exports = mongoose.model('inventories', InventorieSchema)