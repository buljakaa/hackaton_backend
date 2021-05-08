const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
 
const router = express.Router();

const User = require('../model/user');
const { getUnpackedSettings } = require('http2');

// router.post('/registerTeam',async (req, res) => {
//     let user = new User({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         username: req.body.username,
//         password:await bcrypt.hash(req.body.password, 10),
//         phone: req.body.phone,
//         role: req.body.role,
//         gender: req.body.gender,
//     }); 

//     console.log(user);
//         const verificationToken = crypto.createHash('sha256')
//             .update(user.username)
//             .digest('hex');
//     user.verificationToken=verificationToken;
//     user.save(async(err, result) => {
//         if (err) return res.status(500).json({title: 'An error occurred', error: err});
//         await this.sendEmail(user);
//         res.status(201).json({message: 'User created', obj: user});
//     });
// });

    

router.post('/registerUser',async (req, res) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        role: req.body.role,
        gender: req.body.gender,
    }); 

    const verificationToken = crypto.createHash('sha256')
        .update(user.username)
        .digest('hex');
    user.verificationToken = verificationToken;
    await user.save(async (err, result) => {
      
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        await this.sendEmail(user);
        res.status(201).json({message: 'User created', obj: user});
    });
});

exports.sendEmail = async(user) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: "markopoppriboj@gmail.com",
        pass: "rtgaiuisufjwcoga"
        }
      });
   
     const userLink="http://localhost:3000/users/verify?verificationToken="+user.verificationToken;
      const info = await transporter.sendMail({
        from: "<HACKATHON>" + '<' + process.env.MAIL_USERNAME + '>',
        to: user.email, // list of receivers
        subject: '[DIERS] Aktivirajte Vaš nalog', // Subject line
        html: 'Please click <a href="' + userLink + '"> here </a> to activate your account.'
    });
}

router.get('/verify', async (req, res) => {
    if (!req.query.verificationToken) {
        res.sendStatus(401);
        return;
    }
    const verificationToken = req.query.verificationToken;
    try {
        const user = await User.findOne ({'verificationToken': verificationToken});
        
        const hostLink = 'http://localhost:5000/auth/email-confirm';
        const errorLink = 'http://localhost:5000/auth/login';
        if (user) {
            user.verified = true;
            user.verificationToken = '';
            await User.findOneAndUpdate({'_id': user._id}, user, {$unset: {verificationToken: ''}});
           
            res.redirect(hostLink);
        } else {
            res.redirect(errorLink);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.sendStatus(401);
        return;
    }
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.findOne({username: username}).select('+password');
        if (!user) return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid username and/or password!'}
        });
        bcrypt.compare(password, user.password, async (err, data) => {
            console.log("Error in login while checking if passwords matches");
            if (err)
                return res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid email and/or password!'}
                });

            const token = jwt.sign({username: user.username}, 'secret', {expiresIn: 10800});
           
            user.token = token;
            await User.findOneAndUpdate({'_id': user._id}, user, );
          
            res.status(200).json({message: 'Successfully logged in', token: token, userId: user._id});
        });
    } catch
        (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/logout',async (req, res) => {
     
    const user = await User.findOne({username: req.body.username});
    user.token="";
    await User.findOneAndUpdate({'_id': user._id}, user, );
    res.status(201).json({message: 'User successfully logout'});
});

module.exports = router;
