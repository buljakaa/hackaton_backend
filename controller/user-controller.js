const User = require('../model/user');
const Team = require('../model/team');
const nodemailer = require('nodemailer');
const teamController = require('./team-controller');

// I morate napraviti metodu koja ce biti pozvana od strane rute, a ta metoda da poziva odvojenu metodu koja prima samo te parametere
// kao updateUser i updateUserMethod

// Morate da se odlucite da li cete ovako sa callback i da koristite .catch i .then na metodu ili cete sa try-catch blokovima da radite
exports.saveLeader = async (user, res, req) => {
    await user.save(async (err) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        const user1 = await User.findOne({'username': user.username});
        await this.sendEmail(user);
        let codeConst = '';
        await this.makeid(5).then(codePromise => codeConst = codePromise);
        let team = new Team({
            name: req.body.name,
            abbreviation: req.body.abbreviation,
            teamLeader: user1._id,
            code: codeConst
        });
        await teamController.save(team, res, codeConst);
    });
}

// Morate da se odlucite da li cete ovako sa callback i da koristite .catch i .then na metodu ili cete sa try-catch blokovima da radite
exports.saveMember = async (user, res, req) => {
    await user.save(async (err) => {
        if (err) return res.status(500).json({title: 'aaaa', error: err});
        if (req.body.code) {
            const team = await Team.findOne({'code': req.body.code});
            team.teamMembers.push(user._id);
            await Team.findOneAndUpdate({'_id': team._id}, team,);
        }
        await this.sendEmail(user);
        res.status(201).json({message: 'User created', obj: user});
    });
}

// UVEK KORISTI SAMO CONST ILI LET NIKAD 'LET'
exports.makeid = async (length) => {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%^&*';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}


// ovo prebacite u mail-controller.js
exports.sendEmail = async (user) => {
    // ovde dodaj .env varijable koje trebaju za user i pass i ovaj transporter treba u poseban metod da mozes da ga pozivas svaki put kad ti treba
    // posaljes mail
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
        subject: '[HACKATHON] Aktivirajte Vaš nalog', // Subject line
        html: 'Please click <a href="' + userLink + '"> here </a> to activate your account.'
    });
}

// Ne treba svugde da proveravas BODY posebno ako je GET koji nema req.body!
exports.profile = async (req, res) => {
    if (!req.query) {
        res.sendStatus(400);
        return;
    }
    const username = req.query.username;
    try {
        const user = await User.findOne({username: username})
        res.status(200).json(user);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.updateUser = async (req, res) => {
    if (!req.body || !req.query) {
        res.sendStatus(400);
        return;
    }
    // Ovako da izgleda kad se uzimaju TIP i VREDNOST, ako treba iz params onda ce biti req.params.type i req.params.value
    const updatingData = req.body;
    const type = req.query.type;
    const value = req.query.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.updateOneMethod(query, updatingData);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.updateOneMethod = async (query, updatingData) => {
    try {
        const updatedData = await User.findOneAndUpdate(query, updatingData);
        return updatedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
