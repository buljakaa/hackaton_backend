const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const db = require('./db');

const authRoute = require('./routes/auth-router');
const userRoute = require('./routes/user-router');
const teamRoute = require('./routes/team-router');

db.databaseInit();

app.use(express.json());
app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/team', teamRoute);

module.exports = app;
