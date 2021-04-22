const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
        verified: req.body.verified,
        verificationToken: req.body.verificationToken,
        token: req.body.token,
        gender: req.body.gender,
    }); 

    console.log(user);
    user.save((err, result) => {
        if (err) return res.status(500).json({title: 'An error occurred', error: err});
        res.status(201).json({message: 'User created', obj: user});
        
       
       
    });
});




module.exports = router;
 