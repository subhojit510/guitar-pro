const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        index: true,
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pages',
        required: true,
        index: true,
    },
    progress: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
}, {
    timestamps: true
});

ProgressSchema.index({studentId: 1, lessonId: 1}, {unique: true}) // one entry per student per lesson

module.exports = mongoose.model("Progress", ProgressSchema);