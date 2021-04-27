const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
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

    console.log(user);
        const verificationToken = crypto.createHash('sha256')
            .update(user.username)
            .digest('hex');
    user.verificationToken=verificationToken;
    user.save((err, result) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        await this.sendEmail(user);
        res.status(201).json({message: 'User created', obj: user});
    });
});


exports.sendEmail = async(user) => {

    console.log(user.email);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        //    user: process.env.MAIL_USERNAME,
        //   pass: process.env.MAIL_PASSWORD
        user: "markopriboj@gmail.com",
        pass: "rtgaiuisufjwcoga"
        }
      });
    const userLink="localhost:3000/users/verify?verificationToken="+user.verificationToken;
      const info = await transporter.sendMail({
        from: "<HACKATHON>" + '<' + process.env.MAIL_USERNAME + '>',
        to: user.email, // list of receivers
        subject: '[DIERS] Aktivirajte Vaš nalog', // Subject line
        text: 'Aktiviraj nalog, link: ' + userLink, // plain text body
        html: html,
    });
   
     transporter.sendMail(mailOptions, (error, info) => {
       if (error) console.log(error);
       else console.log('Email sent: ' + info.response);
     });
}

router.get('/verify', (req, res) => {

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
            
            user.verified = true;
            user.verificationToken = '';
            await User.updateOneMethod({'_id': user._id}, user, {$unset: {verificationToken: ''}});
            res.redirect(hostLink);
        } else {
            res.redirect(errorLink);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

});

router.post('/login', (req, res) => {
    
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        //no user with provided email address
        if (!user) return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid email and/or password!'}
        });
        console.log(user.password);
        //passwords does not maches
        if (!bcrypt.compare(req.body.password, user.password)) return res.status(401).json({
            title: 'Login failed', 
            error: {message: 'Invalid email and/or password!'}
        });
        //user.token=token;
        //login is success, create token for that u ser
        const token = jwt.sign({user: user}, 'secret', {expiresIn: 10800});
        user.token=token;
        user.save();
        res.status(200).json({message: 'Successfully logged in', token: token, userId: user._id});
    }).select("+password");
});

module.exports = router;
 