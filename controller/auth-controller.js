const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
require('dotenv').config();
 
const router = express.Router();

const User = require('../model/user');
const Team = require('../model/team');

const UserController = require('./user-controller');

const { getUnpackedSettings } = require('http2');


exports.registerTeam = async(req,res) => {
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
    user.verificationToken = verificationToken; 
    UserController.saveLeader(user,res,req);
};


exports.registerUser = async(req,res) => { 
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
    UserController.saveMember(user,res,req);

};

exports.verify = async(req,res) => {

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
};

exports.login = async (req, res) => {
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
};
  
exports.logout = async(req,res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        user.token="";
        await User.findOneAndUpdate({'_id': user._id}, user, );
        res.status(201).json({message: 'User successfully logout'});
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

