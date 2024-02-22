const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username:{type:String, require:true},
    password:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    avatar:{type:String, default:"https://thcsgiangvo-hn.edu.vn/wp-content/uploads/2023/09/anh-mac-dinh-14.jpg"},
    phone:{type:String, unique:true},
    address:{type:String, default:''},
    status:{type:String, enum:['active', 'inactive'], default:'inactive'},
    roles:{type:Array, default:[]}
},{
    timestamps:true,
    collection:'user'
})

module.exports = mongoose.model('user', UserSchema)