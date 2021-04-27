const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// define express router
const router = express.Router();

// importing user model
const User = require('../model/user');
// {
// "firstName":"marko1",
// "lastName":"pop1",
// "email":"taakoje@gmaiil.com1",
// "username":"popara1",
// "password":"macak1",
// "phone":"06521231",
// "role":"glavni ali zamalo",
// "gender":"M"
// }

// {
// "email":"taakoje@gmaiil.com1",
// "password":"macak1"
// }

router.post('/register',async (req, res) => {
//console.log(req.body);  
   // res.status(201).json({message: 'User created', obj: "aa"}); 
    //const data = await User.find();
    //console.log(data);
//    res.status(200).json({"data":req.body});
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password:await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        role: req.body.role,
        gender: req.body.gender,
    }); 

    console.log(user);
    user.save((err, result) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        res.status(201).json({message: 'User created', obj: user});
        
        sendEmail(user);
       
    });
});
//rtgaiuisufjwcoga
function sendEmail (user) {
    console.log(user.email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'markopoppriboj@gmail.com',
          pass: 'rtgaiuisufjwcoga'
        }
      });
      var mailOptions = {
        from: 'markopoppriboj@gmail.com',
        to: user.email,
        subject: 'Welcome to book trading club!',
        html: '<h1>Greeting message</h1><img src="http://www.off-the-recordmessaging.com/wp-content/uploads/2016/04/Thanks-For-Joining-Us1.jpg" /><p>We hope that you will enjoy in our site, find book that you looking for and sell some books too!</p>'
      };
     // proccess.env.MAIL_USERNAME = markopriboj@gmail.com
    //   const info = await transporter.sendMail({
    //     from: '"DIER APP" <' + process.env.MAIL_USERNAME + '>', // sender address
    //     to: user.email, // list of receivers
    //     subject: '[DIERS] Aktivirajte Vaš nalog', // Subject line
    //     text: 'Aktiviraj nalog, link: ' + userLink, // plain text body
    //     html: html, // html body
    // });
   
     transporter.sendMail(mailOptions, (error, info) => {
       if (error) console.log(error);
       else console.log('Email sent: ' + info.response);
     });
}

router.post('/login', (req, res) => {
    
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        //no user with provided email address
        if (!user) return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid email and/or password!'}
        });
        console.log(user.password);
        //passwords does not maches
        if (!bcrypt.compare(req.body.password, user.password)) return res.status(401).json({
            title: 'Login failed', 
            error: {message: 'Invalid email and/or password!'}
        });
        //user.token=token;
        //login is success, create token for that u ser
        const token = jwt.sign({user: user}, 'secret', {expiresIn: 10800});
        user.token=token;
        user.save();
        res.status(200).json({message: 'Successfully logged in', token: token, userId: user._id});
    }).select("+password");
});

module.exports = router;
 