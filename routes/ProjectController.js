const Project = require('../models/Project')

const get = async function (req, res) {
    let id = req.params.id
    try {
        let project = await Project.findOne({_id: id}).exec()
        res.send(project)
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const create = async function (req, res) {
    const {name, desc} = req.body
    let project = new Project({name, desc, createdAt: new Date})

    try {
        await project.save()
        res.send({status: 'success', id: project.id})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const update = async function (req, res) {
    let id = req.params.id
    const {name, desc} = req.body
    let project = await Project.findOne({_id: id}).exec()
    if (!project) res.status(500).send(new Error('Entity not found'))

    try {
        project.name = name
        project.desc = desc
        await project.save()
        res.send({status: 'success'})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const remove = async function (req, res) {
    let id = req.params.id

    try {
        await Project.findByIdAndDelete(id).exec()
        res.send({status: 'success'})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const search = async function (req, res) {
    const {name} = req.body
    let page = req.params.page - 1,
        perPage = 10

    try {
        let query = {}
        if (name !== undefined && name !== '') {
            query.name = {$regex: new RegExp("^" + name, "i")}
        }

        let projects = await Project.find(query).skip(perPage * page).limit(perPage).sort('name').exec()

        let totalProjects = await Project.find(query).countDocuments().exec()
        let totalPage = Math.ceil(totalProjects / perPage)

        res.send({
            page: req.params.page,
            totalPage: totalPage,
            data: projects
        })
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

module.exports = {get, create, update, remove, search}