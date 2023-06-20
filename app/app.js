const createEventRouter = require ('./routes/route_create_event');
const express = require('express');

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/create_event', createEventRouter)

app.listen(3000)

module.exports = app