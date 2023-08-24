const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');

const registerRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max:50 ,
  message: "Too many requests from this IP ! limit exceeded , try again after some time  !",

  headers: true,
  legacyHeaders: false,
});



module.exports=(registerRateLimiter);