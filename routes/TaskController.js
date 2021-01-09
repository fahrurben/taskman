const Task = require('../models/Task')
const {taskStatusTypes} = require('../Constant')

const get = async function (req, res) {
    let id = req.params.id
    try {
        let task = await Task.findOne({_id: id}).exec()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
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
        res.status(500).send(e)
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
        res.status(500).send(e)
    }
}

const remove = async function (req, res) {
    let id = req.params.id

    try {
        await Task.findByIdAndDelete(id).exec()
        res.send({status: 'success'})
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = {get, create, update, remove}