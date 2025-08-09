const mongoose = require('mongoose');

const AssignedLessonsSchema = new mongoose.Schema({
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
        default: 0,
        min: 0,
        max: 100
    },
    teacherRemark:{
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

AssignedLessonsSchema.index({studentId: 1, lessonId: 1}, {unique: true}) // one entry per student per lesson

module.exports = mongoose.model("AssignedLessons", AssignedLessonsSchema);