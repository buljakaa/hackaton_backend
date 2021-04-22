const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const db = require('./db');
var bodyParser = require('body-parser')

db.databaseInit();
const http = require('http');
const User =require("./model/user");
const users =require("./routes/user");
const hostname = '127.0.0.1';
const port = 3000;
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

app.get('/', async(req, res) => {
  const data = await User.find();
  console.log(data);
  res.status(200).json(data);
})

module.exports=app;
