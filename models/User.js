// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    id: {
        type: Number,
        required: true,
        unique: true //เอาไว้ validate
    },
    name: {
        type: String,
        required:true,
        trim:true //ตัด spacebar ที่เกินมา
    },
    age: {
        type:Number,
        min:13,
        max:99
    },
    email: {
        type: String,
        required:true,
        unique:true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        //regular expression
    },
    salt: String,//random string แปะ pw ก่อน hash salt แต่ละครั้งจะไม่เหมือนกัน ต้องเก็บ salt ด้วย
    passwordhash: String,
    admin: {
        type:Boolean, //บอกว่า user บางคนเปน admin บางคนไม่เป็น
        default:false
    },
    created:{
        type:Date,
        default:Date.now
    }
}));