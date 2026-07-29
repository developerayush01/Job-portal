const bcrypt = require('bcrypt');
const { User } = require('../models/index');
const { sendVerificationLink } = require('../utils/firebaseAuth');
const asyncHandler = require('../utils/asyncHandler');

const registerUser=asyncHandler(async(req,res)=>{
const {name,}
});