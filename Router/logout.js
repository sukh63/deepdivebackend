const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


const User = require('../Model/User');



const authenticate = async (req, res, next) =>{
try{
  
    const token = req.cookies.jwtoken;
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifyToken._id});
  
     await User.updateOne({
        "email": rootUser.email
      },
      {
        $pull: {
          "tokens": {
            "token": token
          }
        }
      });
      next();
        

}catch(err){
         res.status(401).send("unauthorized :No token provided");  
           logger.error(err); 
    }
}

module.exports = authenticate;