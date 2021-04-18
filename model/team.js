const mongoose = require('mongoose');
const {Schema} = mongoose;

const teamSchema = new Schema({
    name: {type: String, required: true},
    abbreviation: {type: String, required: true},
    teamLeader: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    teamMembers: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
});

module.exports = mongoose.model('Team', teamSchema);