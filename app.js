var express = require('express');
var app = express();
const dotenv =require('dotenv');
require('./db/conn');
dotenv.config({path:'config.env'});
const cors = require('cors');
const cookieParser = require('cookie-parser');

var whitelist = [process.env.CLIENT_URL]
console.log(whitelist)




app.use(express.json())

var whitelist = [process.env.CLIENT_URL]


var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors({origin:corsOptions, credentials:true}));
app.options('/',cors());
app.use(cookieParser());
app.use(require('./Router/Allroutes'));
app.use(require('./Router/Authenicate'));






app.use(function (req, res, next) {

 
   


  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin',req.headers.origin);

  
  
  
  res.setHeader('Access-Control-Allow-Methods', 'POST','GET','HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authortization,Permissions-Policy');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  })


  app.use((err, req, res, next) => {
    // Middleware for all exposed api's which consumes the json , to handle the json proccessing errors / 
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {

        return res.sendStatus(400);
    }
    next();
});
app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});