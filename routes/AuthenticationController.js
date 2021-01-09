const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../models/User')

const login = async function (req, res) {
    const {email, password} = req.body
    let user = await User.findOne({email: email}).exec()
    if (!user) {
        res.status(500).send({ message: "Wrong email or password!"})
    }

    try {
        let passwordIsCorrect = await bcrypt.compare(password, user.password);

        if (passwordIsCorrect) {
            let token = jwt.sign({
                data: email
            }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
            res.send({status: 'success', token: token})
        } else {
            res.status(500).send({message: "Wrong email or password!"})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

module.exports = {login}