const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotifiSchema = new Schema({
    noti_type:{type:String, enum:['SHOP-001', 'ORDER-001', 'ORDER-002', 'PROMOTION-001']},
    noti_senderId:{type:String, require:true,  ref:'user'},
    noti_receivedId:{type:Number, require:true},
    noti_content:{type:String, require:true},
    noti_option:{type:Object, default:{}}
},{
    timestamps:true,
    collection:'notifi'
})

module.exports = mongoose.model('notifi', NotifiSchema)
