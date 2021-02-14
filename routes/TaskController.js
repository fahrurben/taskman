const Task = require('../models/Task')
const {taskStatusTypes} = require('../Constant')

const get = async function (req, res) {
    let id = req.params.id
    try {
        let task = await Task.findOne({_id: id}).exec()
        res.send(task)
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const create = async function (req, res) {
    const {no, project, title, desc, priority, dueDate} = req.body
    let task = new Task({
        no,
        project,
        title,
        desc,
        priority,
        status: taskStatusTypes.BACK_LOG,
        dueDate,
        createdAt: new Date
    })

    try {
        await task.save()
        res.send({status: 'success', id: task.id})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const update = async function (req, res) {
    let id = req.params.id
    const {no, project, title, desc, priority, status, dueDate} = req.body
    let task = await Task.findOne({_id: id}).exec()
    if (!task) res.status(500).send(new Error('Entity not found'))

    try {
        task.no = no
        task.project = project
        task.title = title
        task.desc = desc
        task.priority = priority
        task.status = status
        task.dueDate = dueDate
        await task.save()
        res.send({status: 'success'})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const remove = async function (req, res) {
    let id = req.params.id

    try {
        await Task.findByIdAndDelete(id).exec()
        res.send({status: 'success'})
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

const search = async function (req, res) {
    const {no, title, priority, status} = req.body
    let page = req.params.page - 1,
        perPage = 10

    try {
        let query = {}
        if (no !== undefined && no !== '') {
            query.no = {$regex: new RegExp("^" + no, "i")}
        }

        if (title !== undefined && title !== '') {
            query.title = {$regex: new RegExp("^" + title, "i")}
        }

        if (priority !== undefined && priority !== '') {
            query.priority = {$eq: priority}
        }

        if (status !== undefined && status !== '') {
            query.status = {$eq: status}
        }

        let tasks = await Task.find(query).populate('project').skip(perPage * page).limit(perPage).sort('no').exec()

        let totalTasks = await Task.find(query).countDocuments().exec()
        let totalPage = Math.ceil(totalTasks / perPage)

        res.send({
            page: req.params.page,
            totalPage: totalPage,
            data: tasks
        })
    } catch (e) {
        res.status(500).send({message: e.toString()})
    }
}

module.exports = {get, create, update, remove, search}