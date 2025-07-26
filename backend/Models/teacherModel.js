const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: true,
        min: 6,
        max: 6,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    email: {
        type: String,
        required: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    role: {
        type: String,
        default: "Teacher"
    }, students: [{
        type: String,
        match: /^[0-9]{6}$/, // 6-digit number strings only
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model("Teacher", TeacherSchema);