const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

const User = require('../model/user');

router.post('/register',async (req, res) => {

    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password:await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        role: req.body.role,
        gender: req.body.gender,
    }); 

        const verificationToken = crypto.createHash('sha256')
            .update(user.username)
            .digest('hex');
    user.verificationToken=verificationToken;
    user.save(async(err, result) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        await this.sendEmail(user);

        res.status(201).json({message: 'User created', obj: user});
    });
});

exports.sendEmail = async(user) => {
    console.log("Username");
    console.log(process.env.MAIL_USERNAME);
    console.log("Username");
    console.log("Password");
    console.log(process.env.MAIL_PASSWORD);
    console.log("Passsword");
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: "markopriboj@gmail.com",
        pass: "rtgaiuisufjwcoga"
        }
      });
      let mailOptions = {
        from: "<HACKATHON>" + '<' + process.env.MAIL_USERNAME + '>',
        to: user.email,
        subject: 'Welcome to Hackaton!',
        html: '<h1>Greeting message</h1><img src="http://www.off-the-recordmessaging.com/wp-content/uploads/2016/04/Thanks-For-Joining-Us1.jpg" /><p>We hope that you will enjoy in our site, find book that you looking for and sell some books too!</p>'
      };

   transporter.sendMail(mailOptions, (error, info) => {
       if (error) console.log(error);
       else console.log('Email sent: ' + info.response);
     });
}

router.get('/verify',async (req, res) => {

    if (!req.params.verificationToken) {
        res.sendStatus(401);
        return;
    }
    const verificationToken = req.query.verificationToken;
    try {
        const user =   await User.findOne      ({'verificationToken': verificationToken});
        const hostLink = 'http://localhost:5000/auth/email-confirm';
        const errorLink = 'http://localhost:5000/auth/login';
        if (user) {
            res.status(201).json({message: 'User created'});
        } else {
            res.status(201).json({message: 'User neeeeee'});
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

});

router.post('/login', (req, res) => {
    
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
  
        if (!user) return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid email and/or password!'}
        });
    
        if (!bcrypt.compare(req.body.password, user.password)) return res.status(401).json({
            title: 'Login failed', 
            error: {message: 'Invalid email and/or password!'}
        });
        const token = jwt.sign({user: user}, 'secret', {expiresIn: 10800});
        user.token=token;
        user.save();
        res.status(200).json({message: 'Successfully logged in', token: token, userId: user._id});
    }).select("+password");
});

module.exports = router;
 