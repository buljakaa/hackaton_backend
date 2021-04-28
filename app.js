const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const db = require('./db');
db.databaseInit();
const users =require("./routes/user");

app.use(express.json());
app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use("/users",users);

module.exports=app;
