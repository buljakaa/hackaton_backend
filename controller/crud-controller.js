const User = require('../model/user');

exports.updateUser = async (req, res) => {
    if (!req.body || !req.query) {
        res.sendStatus(400);
        return;
    }
    const updatingData = req.body;
    const query=req.query.lastName;
    try {
        const data = await this.updateOneMethod(query, updatingData);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.updateOneMethod = async (query, updatingData, options = {}) => {
    try {
        const updatedData = await User.findOneAndUpdate(query, updatingData, options);
        return updatedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};