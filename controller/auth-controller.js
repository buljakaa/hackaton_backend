require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/user');
const UserController = require('./user-controller');
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID);


exports.gitId = async (req, res) => {
console.log(req)
}

exports.registerGoogle = async (req, res) => {
    try{

    const  token1   = req.body;
    
    const ticket = await client.verifyIdToken({
       idToken: token1,
       audience:process.env.CLIENT_ID
     });
 
   const { name, email, picture } = ticket.getPayload();    

   const user = await db.user.upsert({ 
       where: { email: email },
       update: { name, picture },
       create: { name, email, picture }
   })

    const query = { email: email };
    const update = { $set: { name: name }};
    const options = { upsert: true };
    User.updateOne(query, update, options);

    res.status(201)
    res.json(user)
   }catch (e) {
      console.log(e);
      res.sendStatus(500);
   }    
};



exports.registerTeam = async (req, res) => {
 
    if (!req.body || !req.query) {
        res.sendStatus(400);
        return;
    }
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        role: 'contestant',
        gender: req.body.gender,
    };
    const team = {
        name: req.body.name,
        abbreviation: req.body.abbreviation,
    }
    try {
        const verificationToken = crypto.createHash('sha256')
            .update(user.username)
            .digest('hex');
        user.verificationToken = verificationToken;
        const teamCode = await UserController.saveLeader(user, team);
        res.status(201).json({message: 'Team created', code: teamCode});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.registerUser = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    let code = undefined;
    if (req.body.code) {
        code = req.body.code;
    }
    let user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        role: 'contestant',
        gender: req.body.gender,
    };
    const verificationToken = crypto.createHash('sha256')
        .update(user.username)
        .digest('hex');
    user.verificationToken = verificationToken;
    try {
        user = await UserController.saveMember(user, code);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};


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
    const rememberMe = req.body.rememberMe;
    let expiresIn = '30m';
    if  (rememberMe) {
        expiresIn = '730h';
    }
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

            const token = jwt.sign({username: user.username}, 'secret', {expiresIn: expiresIn});
            user.token = token;
            await User.findOneAndUpdate({'_id': user._id}, user);

            res.status(200).json({message: 'Successfully logged in', token: token, username: user.username});
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

exports.logout = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    try {
        const user = await User.findOne({username: req.body.username});
        user.token = '';
        await User.findOneAndUpdate({'_id': user._id}, user,);
        res.status(201).json({message: 'User successfully logout'});
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        res.sendStatus(500);
    }
};

