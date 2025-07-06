const mongoose = require('mongoose');

const PagesSchema = new mongoose.Schema({
    name :{
        type: String,
        required : true,
    },
    googleLink: {
        type: String,
        required: true,
        unique: true
    },
    userAccess: [ {
    type: String,
    match: /^[0-9]{6}$/, // 6-digit number strings only
  }]
}) 

module.exports = mongoose.model("Pages", PagesSchema);