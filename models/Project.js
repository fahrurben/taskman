const mongoose = require('mongoose')
const { Schema } = mongoose

const projectSchema = new Schema({
    name:   { type: String, required: true },
    desc:  { type: String, required: true },
    createdAt: { type: Date, required: true }
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project