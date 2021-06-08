const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const db = require('./db');

const authRoute = require('./routes/auth-router');
const userRoute = require('./routes/user-router');
const teamRoute = require('./routes/team-router');

db.databaseInit();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

var access_token = "";

const axios = require('axios')
const clientID = '618c56e796c5e1b017ed'
const clientSecret = '980d65b08bac5c7f846d15a102de29582a39a6cd'


app.get('/github/callback', (req, res) => {
  const requestToken = req.query.code
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

app.get('/success', function(req, res) {
  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/index',{ userData: response.data });
  })
});


app.use(express.json());
app.use(cors());
app.use(logger('dev'));
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
