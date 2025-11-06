const mongoose = require('mongoose');
const brandSchema=new mongoose.Schema({
    userid:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:{type:String,required:true},
    industry:{type:String},
},{timestamp:true});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;