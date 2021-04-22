const express = require('express');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');


// define express router
const router = express.Router();

// importing user model
const User = require('../model/user');
// {"firstName":"marko",
// "lastName":"pop",
// "email":"taakoje@gmaiil.com",
// "username":"popara",
// "password":"macak",
// "phone":"06521231",
// "role":"glavni ali zamalo",
// "verified":true,
// "verificationToken":true,
// "token":"123",
// "gender":"M"
// }
router.post('/register', async(req, res) => {
console.log(req.body);
   // res.status(201).json({message: 'User created', obj: "aa"}); 
    //const data = await User.find();
    //console.log(data);
   // res.status(200).json({"data":data});
    // var user = new User({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     username: req.body.username,
    //     password: req.body.password,
    //     phone: req.body.phone,
    //     role: req.body.role,
    //     verified: req.body.verified,
    //     verificationToken: req.body.verificationToken,
    //     token: req.body.token,
    //     gender: req.body.gender,
    // });

    
    // user.save((err, result) => {
    //     if (err) return res.status(500).json({title: 'An error occurred', error: err});
    //     res.status(201).json({message: 'User created', obj: result});
        
       
       
    // });
});
module.exports = router;
