const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KeySchema = new Schema({
    key_userId:{type:String, require:true, ref:'user'},
    publicKey:{type:String, require:true},
    privateKey:{type:String, require:true},
    refreshTokenUsed:{type:Array, default:[]},
    refreshToken:{type:String, require},
},{
    timestamps:true,
    collection:'key'
})

module.exports = mongoose.model('key', KeySchema)
