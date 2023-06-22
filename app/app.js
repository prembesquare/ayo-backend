const createEventRouter = require('./routes/route_create_event');
const user = require('./routes/route_account');
const jwtMiddleware = require('./middleware');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', user);
app.use('/create_event',jwtMiddleware, createEventRouter);

app.listen(3000);

module.exports = app;