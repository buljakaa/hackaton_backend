
const User = require('../model/user');
const Team = require('../model/team');
const nodemailer = require('nodemailer');

const TeamController = require('./team-controller');

exports.saveLeader = async(user,res,req) => {

    console.log("uspooo iznad");
    await user.save(async(err) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        const user1 = await User.findOne ({'username': user.username});
        await this.sendEmail(user);
        let codeConst="";
        await this.makeid(5).then(codePromise=>codeConst=codePromise);
        console.log("uspooo unutra");
        console.log(codeConst);
        let team = new Team({
            name: req.body.name,
            abbreviation: req.body.abbreviation,
            teamLeader:user1._id,
            code:codeConst
            
        }); 
        TeamController.save(team,res,codeConst);
     
    });
}

exports.saveMember = async(user,res,req) => {


    await user.save(async (err) => {
      
        if (err) return res.status(500).json({title: 'aaaa', error: err});
        if(req.body.code){
            const team = await Team.findOne ({'code': req.body.code});
            team.teamMembers.push(user._id);
            await Team.findOneAndUpdate({'_id': team._id}, team, );
        }
        await this.sendEmail(user);
        res.status(201).json({message: 'User created', obj: user}); 
    });
}

exports.makeid =async(length)=>{
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%^&*';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
} 

exports.sendEmail = async(user) => {

    let transporter = nodemailer.createTransport({ 
        service: 'gmail',  
        auth: {
        user: "markopoppriboj@gmail.com",
        pass: "rtgaiuisufjwcoga"
        }
      });
   
     const userLink="http://localhost:3000/auth-user/verify?verificationToken="+user.verificationToken;
      const info = await transporter.sendMail({
        from: "<HACKATHON>" + '<' + process.env.MAIL_USERNAME + '>',
        to: user.email, // list of receivers
        subject: '[DIERS] Aktivirajte Vaš nalog', // Subject line
        html: 'Please click <a href="' + userLink + '"> here </a> to activate your account.'
    });
}




exports.profile = async (req, res) => {
    
    if (!req.body || !req.query) {
        res.sendStatus(400); 
        return;
    }
    
    const username=req.query.username;
    console.log(username);
    try {
        const user = await User.findOne({username: username})
        console.log(user);
        res.status(200).json({message: 'Successfully find user',user:user});
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