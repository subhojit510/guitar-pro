const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        required: true,
        index: true,
    },
    teacherId: {
        type: String,
        required: true,
        index: true,
    },
    status:{
        type: String,
        enum: ['scheduled', 'completed'],
        default: 'scheduled',
        required: true,
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

classSchema.index({studentId: 1, teacherId: 1})

module.exports = mongoose.model("Classes", classSchema);