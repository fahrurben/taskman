const User = require('../models/User')

const get = async function (req, res) {
    let id = req.params.id
    try {
        let project = await User.findOne({_id: id}).exec()
        res.send(project)
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const update = async function (req, res) {
    let id = req.params.id
    const {firstName, lastName, isActive} = req.body
    let user = await User.findOne({_id: id}).exec()
    if (!user) res.status(500).send(new Error('Entity not found'))

    try {
        user.firstName = firstName
        user.lastName = lastName
        user.isActive = isActive
        await user.save()
        res.send({status: 'success'})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const remove = async function (req, res) {
    let id = req.params.id

    try {
        await User.findByIdAndDelete(id).exec()
        res.send({status: 'success'})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}


const search = async function (req, res) {
    const {firstName, lastName, email, isActive} = req.body
    let page = req.params.page - 1,
        perPage = 10

    try {
        let query = {}
        if (firstName !== undefined && firstName !== '') {
            query.firstName = {$regex: new RegExp("^" + firstName, "i")}
        }
        if (lastName !== undefined && lastName !== '') {
            query.lastName = {$regex: new RegExp("^" + lastName, "i")}
        }
        if (email !== undefined && email !== '') {
            query.email = {$regex: new RegExp("^" + email, "i")}
        }
        if (isActive !== undefined && isActive !== '') {
            query.isActive = {$eq: isActive}
        }

        let users = await User.find(query).skip(perPage * page).limit(perPage).sort('name').exec()

        let totalUsers = await User.find(query).countDocuments().exec()
        let totalPage = Math.ceil(totalUsers / perPage)

        res.send({
            page: req.params.page,
            totalPage: totalPage,
            data: users
        })
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

module.exports = {get, update, remove, search}