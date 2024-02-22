const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    product_name:{type:String, require:true},
    product_price:{type:Number, require:true},
    product_quantity:{type:Number, require:true},
    product_userId:{type:String, require:true, ref:'user'},
    product_type:{type:String, require:true, enum:['clothing', 'electronic']},
    product_slug:String,
    product_thumb:String,
    product_description:String,
    product_rating:{
        type:Number, 
        default:4.5, 
        min:[1, '1 sao'],
        max:[5, '5 sao'],
        set:(val) => Math.round(val*10) /10
    },
    product_attributes:Schema.Types.Mixed,
    isDraft:{type:Boolean, default:true, index:true, select:false},
    isPublished:{type:Boolean, default:false, index:true, select:false}
},{
    timestamps:true,
    collection:'product'
})

ProductSchema.index({product_name: 'text', product_description: 'text'})

ProductSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower:true})
    next()
})

const ClothingSchema = new Schema({
    product_userId:{type:String, require:true},
    product_images:{type:Array, default:[]},
    product_sizes:{type:Array, default:[]},
    product_colors:{type:Array, default:[]},
    product_brand:String,
    product_material:String
}, {
    timestamps:true,
    collection:'clothing'
})

const ElectronicSchema = new Schema({
    product_userId:{type:String, require:true},
    product_images:{type:Array, default:[]},
    product_models:{type:Array, default:[]},
    product_colors:{type:Array, default:[]},
    product_manufacturer:String,
}, {
    timestamps:true,
    collection:'electronic'
})

module.exports = {
    ProductModel:mongoose.model('product', ProductSchema),
    ClothingModel:mongoose.model('clothing', ClothingSchema),
    ElectronicModel:mongoose.model('electronic', ElectronicSchema),
}