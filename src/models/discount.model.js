const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DiscountSchema = new Schema({
    discount_name:{type:String, require:true},
    discount_description:{type:String, require:true},
    discount_type:{type:String, default:'fixed', enum:['fixed', 'percent']},
    discount_value:{type:Number, require:true},
    discount_code:{type:String, require:true},
    discount_start_date:{type:Date, require:true},
    discount_end_date:{type:Date, require:true},
    discount_max_use:{type:Number, require:true}, // So luong discount duoc su dung
    discount_count_use:{type:Number, require:true}, // so luong discount da su dung
    discount_users_used:{type:Array, default:[]}, // user nao da su dung discount nay
    discount_max_use_per_user:{type:Number, require:true}, // so luong su dung discount cua moi user
    discount_min_order_value:{type:Number, require:true}, // gia tri don hang toi thieu
    discount_userId:{type:String, require:true, ref:'user'},

    discount_is_active:{type:Boolean, default:true},
    discount_apply_to:{type:String, require:true, enum:['all', 'specific']}, //discount duoc ap dung the nao tat ca or 1 so mat hang
    discount_product_ids:{type:Array, default:[]} //nhung san pham duoc ap dung
},{
    timestamps:true,
    collection:'discount'
})

module.exports = mongoose.model('discount', DiscountSchema)