const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('express-jwt')
const app = express()
const ProjectController = require('./routes/ProjectController')
const TaskController = require('./routes/TaskController')
const AuthenticationController = require('./routes/AuthenticationController')
const UserController = require('./routes/UserController')

app.use(bodyParser.json());
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
const port = process.env.PORT
const jwtSecret = process.env.TOKEN_SECRET

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.once('open', () => { console.log('MongoDB Connected'); });
mongoose.connection.on('error', (err) => { console.log('MongoDB connection error: ', err); });
const db = mongoose.connection;

app.use(jwt({ secret: jwtSecret, algorithms: ['HS256']}).unless({
    path: [
      '/',
      '/login',
      '/register',
    ]
}));

app.get('/project/:id', ProjectController.get)
app.get('/project', ProjectController.getAll)
app.post('/project', ProjectController.create)
app.post('/project/:id', ProjectController.update)
app.get('/project/:id/delete', ProjectController.remove)
app.post('/project/search/:page', ProjectController.search)

app.get('/task/:id', TaskController.get)
app.post('/task', TaskController.create)
app.post('/task/:id', TaskController.update)
app.get('/task/:id/delete', TaskController.remove)
app.post('/task/search/:page', TaskController.search)

app.get('/user/:id', UserController.get)
app.post('/user/:id', UserController.update)
app.get('/user/:id/delete', UserController.remove)
app.post('/user/search/:page', UserController.search)

app.post('/login', AuthenticationController.login)
app.post('/register', AuthenticationController.register)

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})