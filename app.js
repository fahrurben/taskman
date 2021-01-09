const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const ProjectController = require('./routes/ProjectController')

app.use(bodyParser.json());

dotenv.config()
const port = process.env.PORT

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;

app.get('/project/:id', ProjectController.get)
app.post('/project', ProjectController.create)
app.post('/project/:id', ProjectController.update)
app.get('/project/:id/delete', ProjectController.remove)

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})