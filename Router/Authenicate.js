const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const User = require("../Model/User");
const router = express.Router();




const Authenticate = async(req, res, next) =>{
try{

    const token = req.cookies.jwtoken;



    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({ _id: verifyToken._id,"tokens.token": token});

    if(!rootUser){ throw new Error('User Not Found') }
    
    req.token = token;
    req.rootUser= rootUser;
    req.work=rootUser.work;
    req.fname=rootUser.fname;
    req.lname=rootUser.lname;
    req.phone=rootUser.phone;
    req.email=rootUser.email;
    req.userID = rootUser._id;
   
    
next();

}catch(err){
         res.status(401).send("unauthorized :No token provided");  
         
}

}

module.exports = Authenticate;