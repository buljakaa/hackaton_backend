require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const User = require('../model/user');
const Team = require('../model/team');


exports.registerTeam = async (req, res) => {

    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        role: 'contestant',
        gender: req.body.gender,
    });

    const verificationToken = crypto.createHash('sha256')
        .update(user.username)
        .digest('hex');
    user.verificationToken = verificationToken;

    await user.save(async (err, result) => {
        console.log(err);
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        const user1 = await User.findOne({'username': req.body.username});
        await this.sendEmail(user);
        let codeConst = '';
        await this.makeid(5).then(codePromise => codeConst = codePromise);
        let team = new Team({
            name: req.body.teamName,
            abbreviation: req.body.teamAbb,
            teamLeader: user1._id,
            code: codeConst
        });
        team.save(async (err, result) => {
            if (err) return res.status(500).json({title: 'An error occurred', error: err});
            res.status(201).json({message: 'Team created', obj: codeConst});
        });
    });

};

exports.makeid = async (length) => {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%^&*';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

exports.registerUser = async (req, res) => {

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
        if (err) return res.status(500).json({title: 'aaaa', error: err});
        if (req.body.code) {
            const team = await Team.findOne({'code': req.body.code});
            team.teamMembers.push(user._id);
            await Team.findOneAndUpdate({'_id': team._id}, team,);
        }
        await this.sendEmail(user);
        res.status(201).json({message: 'User created', obj: user});
    });

};

exports.sendEmail = async (user) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'markopoppriboj@gmail.com',
            pass: 'rtgaiuisufjwcoga'
        }
    });

    const userLink = 'http://localhost:3000/auth-user/verify?verificationToken=' + user.verificationToken;
    const info = await transporter.sendMail({
        from: '<HACKATHON>' + '<' + process.env.MAIL_USERNAME + '>',
        to: user.email, // list of receivers
        subject: '[DIERS] Aktivirajte Vaš nalog', // Subject line
        html: 'Please click <a href="' + userLink + '"> here </a> to activate your account.'
    });
}

exports.verify = async (req, res) => {

    if (!req.query.verificationToken) {
        res.sendStatus(401);
        return;
    }
    const verificationToken = req.query.verificationToken;
    try {
        const user = await User.findOne({'verificationToken': verificationToken});

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
            console.log('Error in login while checking if passwords matches');
            if (err)
                return res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid email and/or password!'}
                });

            const token = jwt.sign({username: user.username}, 'secret', {expiresIn: 10800});

            user.token = token;
            await User.findOneAndUpdate({'_id': user._id}, user,);

            res.status(200).json({message: 'Successfully logged in', token: token, username: user.username});
        });
    } catch
        (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

exports.logout = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        user.token = '';
        await User.findOneAndUpdate({'_id': user._id}, user,);
        res.status(201).json({message: 'User successfully logout'});
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

