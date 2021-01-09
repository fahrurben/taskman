const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../models/User')

const login = async function (req, res) {
    const {email, password} = req.body
    let user = await User.findOne({email: email}).exec()
    if (!user) {
        res.status(500).send({message: "Wrong email or password!"})
    }

    try {
        let passwordIsCorrect = await bcrypt.compare(password, user.password);

        if (passwordIsCorrect) {
            let token = jwt.sign({
                data: email
            }, process.env.TOKEN_SECRET, {expiresIn: 60 * 60});
            res.send({status: 'success', token: token})
        } else {
            res.status(500).send({message: "Wrong email or password!"})
        }
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const register = async function (req, res) {
    const {email, password, firstName, lastName} = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
        let exisingUser = await User.findOne({email: email}).exec()

        if (exisingUser) {
            throw new Error('User already registered')
        }

        let user = new User({email, password: hashedPassword, firstName, lastName})

        await user.save()
        res.send({status: 'success', id: user.id})
    } catch (e) {
        console.log(e)
        res.status(500).send({message: e.toString()})
    }
}

module.exports = {login, register}