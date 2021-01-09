const mongoose = require('mongoose')
const { Schema } = mongoose

const taskSchema = new Schema({
    no: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    status: {
        type: String,
        enum: ['BACK_LOG', 'IN_PROGRESS', 'DONE'],
        required: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'NORMAL', 'HIGH'],
        required: true
    },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, required: true }
});

const Task = mongoose.model('Task', taskSchema)

module.exports = Task