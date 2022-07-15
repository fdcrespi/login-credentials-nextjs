"use strict";

//const mongoose = require("mongoose");
import mongoose from 'mongoose'
//const bcrypt = require("bcryptjs");
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['user','admin','super'],
        default: "user"
    }
}, {timestamps: true});

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

//module.exports = mongoose.model('User', UserSchema);
let Dataset = mongoose.models.users || mongoose.model('users', UserSchema);
export default Dataset;