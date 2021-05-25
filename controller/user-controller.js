const User = require('../model/user');
const Team = require('../model/team');

const teamController = require('./team-controller');
const mailController = require('./mail-controller');


exports.saveLeader = async (query) => {

    let user=query.user;
    user=await User.create(user);
    await mailController.sendEmail(query.user);
    let codeConst = '';
    await this.makeid(5).then(codePromise => codeConst = codePromise);
    let team = new Team({
        name: query.name,
        abbreviation: query.abbreviation,
        teamLeader: user._id,
        code: codeConst
    });
    await teamController.save(team);
    return codeConst;

}

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


exports.saveMember = async (user, res, req) => {
    await user.save(async (err) => {
        if (err) return res.status(500).json({title: 'aaaa', error: err});
        if (req.body.code) {
            const team = await Team.findOne({'code': req.body.code});
            team.teamMembers.push(user._id);
            await Team.findOneAndUpdate({'_id': team._id}, team,);
        }
        await mailController.sendEmail(user);
        res.status(201).json({message: 'User created', obj: user});
    });
}

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

//////////////

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
    console.log(type);
    console.log(value);
    let query = {};
    query[type] = value;
    try {
        const data = await this.deleteManyMethod(query);
        console.log(data);
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