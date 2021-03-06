const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    email:  { type: String, required: true },
    password:  { type: String, required: true },
    firstName:   { type: String, required: true },
    lastName:  { type: String, required: true },
    isActive: { type: Boolean, required: true, select: false }
})

const User = mongoose.model('User', userSchema)

module.exports = User