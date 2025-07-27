const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        min: 6,
        max: 6,
        unique: true,
    },
    username :{
        type: String,
        required : true,
        min : 3,
        max: 20,
    },
    email:{
        type: String,
        required : true,
        max: 50,
    },
    password: {
        type: String,
        required : true,
        min: 5,
    },
  role: { 
    type: String, 
    default: "User" 
},
teacher:{
    type: String,
    default: null,
    required: false
},
createdAt: {
    type: Date, 
    default: Date.now 
},
}) 

module.exports = mongoose.model("Users", UserSchema);