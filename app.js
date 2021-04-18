const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

module.exports=app;
