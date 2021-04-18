const mongoose = require('mongoose');

exports.databaseInit = () => {
    const env = process.env.NODE_ENV || 'development';
    let dbURI = process.env.DB;
    if (env === 'development')
        dbURI = 'mongodb://localhost:27017/hackaton';
    try {
        mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        const db = mongoose.connection;
        db.on('error', (err) => {
            console.log(err);
        });
        db.once('open', () => {
            console.log('[DB] Connection to database initialized!');
        });
    } catch (err) {
        console.log('[DB] Problem with connecting with database!');
        console.log(err);
    }
};