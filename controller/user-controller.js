const User = require('../model/user');
const Team = require('../model/team');
const teamController = require('./team-controller');
const mailController = require('./mail-controller');
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

// trebali ste da koristite u saveLeader metodu neku kao npr SaveUser i da pozivate nju i ovde i u
// auth-controller kad cuvate korisnika

exports.saveLeader = async (user, team) => {
    try {
        user = await User.create(user);
        await mailController.sendEmail(user);
        const codeConst = await this.makeid(5);
        team.user = user._id;
        team.code = codeConst;
        await teamController.save(team);
        return codeConst;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

exports.saveMember = async (user, code) => {
    try {
        user = await User.create(user);
        await mailController.sendEmail(user);
        if (code) {
            const team = await Team.findOne({'code': code});
            team.teamMembers.push(user._id);
            await Team.findOneAndUpdate({'_id': team._id}, team);
        }
        return user;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

exports.readOne = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const data = await this.readOneMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.readOneMethod = async (query, options = {}) => {
    try {
        const foundData = await User.findOne(query).select(options);
        return foundData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.readMany = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.readManyMethod = async (query) => {
    try {
        const foundData = await User.find(query);
        return foundData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.updateOne = async (req, res) => {
    if (!req.body || !req.params) {
        res.sendStatus(400);
        return;
    }
    const updatingData = req.body;
    const type = req.params.type;
    const value = req.params.value;
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

exports.updateMany = async (req, res) => {
    if (!req.body || !req.params.type || !req.params.value) {
        res.sendStatus(400);
        return;
    }
    const updatingData = req.body;
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.updateManyMethod(query, updatingData);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.updateManyMethod = async (query, updatingData) => {
    try {
        const updatedData = await User.updateMany(query, updatingData);

        
        return updatedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.deleteOne = async (req, res) => {
    if (!req.params.type || !req.params.value) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.deleteOneMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.deleteOneMethod = async (query) => {
    try {
        const deletedData = await User.findOneAndDelete(query);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

//JANJE
exports.deleteMany = async (req, res) => {
    if (!req.params.type || !req.params.value) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.deleteManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.deleteManyMethod = async (query) => {
    try {
        const deletedData = await User.deleteMany(query);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.profile = async (req, res) => {
    if (!req.query) {
        res.sendStatus(400);
        return;
    }
    const username = req.query.username;
    try {
        const user = await User.findOne({username: username});
        res.status(200).json(user);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};
