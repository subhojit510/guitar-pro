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
        type: Date,
        required: true
    },
}, {
    timestamps: true
});

ProgressSchema.index({studentId: 1, teacherId: 1}) // one entry per student per lesson

module.exports = mongoose.model("Classes", classSchema);