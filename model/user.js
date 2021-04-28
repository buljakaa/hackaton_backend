const mongoose = require('mongoose');
const {Schema} = mongoose;
const express = require('express');


const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    phone: {type: String, required: true},
    role: {type: String, required: true},
    verified: {type: Boolean, required: true, default: false},
    verificationToken: {type: String, required: false},
    token: {type: String, required: false},
    gender:{type: String, enum: ['M','Z'], required: true},
    education:{type: String, required: false},
    yearOfStudy:{type: Number, required: false}, 
});

module.exports = mongoose.model('User', userSchema);
