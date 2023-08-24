const express = require('express');
const router = express.Router();
const Contact=require("../Model/Contact");
const User=require("../Model/User");
const cors = require('cors');
const logout = require("./Logout")
const Registerratelimit =require("../Ratelimit/registerRateLimiter")

const Loginratelimit = require('../Ratelimit/Loginratelimit');
var whitelist = [process.env.CLIENT_URL]
const Book=require("../Model/Book");
const Authenticate=require("./Authenicate");
const Review=require("../Model/Reviewschems");
const bcrypt = require('bcryptjs');
var whitelist = [process.env.CLIENT_URL]
const dotenv =require('dotenv');


dotenv.config({path:'config.env'});


var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}





//loggedin userdata
router.get('/getdata',Authenticate,cors(corsOptions),(req, res) => {
   console.log('hello my contactdeedd page');
    console.log(req.rootUser);
     res.send(req.rootUser);
     
 
     
   }); 
//Registration api
router.post('/register',Registerratelimit,cors(corsOptions),  async  (req, res) => {
    try{
   
        const {fname,email,password,cpassword} =req.body;
        console.log({fname,email,password,cpassword})
     

        if(!fname || !email   || !password || !cpassword){
            return res.status(400).json({error:"All details to be filled ! "})
        }
    
        User.findOne({email:email})
        .then((userexist)=>{
            if(userexist){
                return res.status(422).json({error:"Please Try Another Email Account"});

            }else if(password !=cpassword){
                return res.status(400).json({error:"password does match"});
            }
            const user= new User({fname,email,password,cpassword});

            user.save().then(() => {
                return res.status(200).json({error:"Registration successfull"});
               
              }).catch((err)=>
            console.log(err,"hiii")
            );

        }).catch(err=>{console.log(err);});

    }
    catch (error) {

    console.log(error.message);
        res.status(500).send(error.message);
    }

});

//Login Api
router.post('/login',Loginratelimit,  async (req,res) =>{
    try{


        
        let token;
        
        const {email,password} =req.body;
        console.log({email,password})
       
        
    
      
        if(!email || !password){
            return res.status(400).json({error:"Plz fill the data"})
        }
        const userLogin =await User.findOne({email:email});
        if(userLogin){
            console.log(userLogin)
            const isMatch= await bcrypt.compare(password,userLogin.password);

            if(!isMatch){
                return res.status(400).json({error:"Invlalid Credentials"});
            }else{
         token= await userLogin.generateAuthToken();
             
                

                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now()+ 86400000),

                    httpOnly:true
                });
                return res.json({message:"user login succesfully"});
                
            }
        }else{
            return res.status(400).json({error:"Invlalid Credentials"});
        }
       
       

    }catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

//Logout

router.get('/logout',cors(corsOptions),logout, (req, res) => {
    //logger.info('hello my logout page');
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('user logout');
    
  }); 


  //add book route

  router.post('/postbook',Authenticate,cors(corsOptions), (req, res) => {
    
   const userid=req.rootUser._id;
   console.log(userid,"userid")

    const title = req.body.title;
    console.log(title)
    const author = req.body.author;
    const ISBN = req.body.ISBN;
    const date=new Date();


    try{
      const Books = new Book({ title,author,ISBN,date,userid });
      Books.save(async (err, data) => {
          if (err) throw err;
          return res.status(200).json({'mes': 'Book saved'})
      })

      }catch (error) {
        logger.error(error.message);
        res.status(500).send(error.message);
    };

  })

//get all books after Login
  router.get('/getallbooks',cors(corsOptions),Authenticate, (req, res) => {
    try{
      Book.find(function(err,data){
        if (err) throw err;
        return res.json(data);
      })

    }catch (error) {
        logger.error(error.message);
        res.status(500).send(error.message);
    };

  })


//get books by id
  router.get('/getbook/:id',cors(corsOptions),Authenticate,async function(req,res){
    try{
    var _id = req.params.id;

    const dataitem =await Book.findOne({_id :_id});
        if(dataitem){
            return res.json(dataitem)
        }else{
            return res.json({"err": "id not found"})
        }
    }catch (error) {
        logger.error(error.message);
        res.status(500).send(error.message);
    }
})


//delete book

router.post('/deletebook',cors(corsOptions),Authenticate, function(req,res){

    const id = req.body.id;

    try{
 

        Book.deleteOne({_id:id}, function(err,data){
            if (err) throw err;
            else return res.json({'mess':'Book deleted'})
        })
    }catch (error) {
        logger.error(error.message);
        res.status(500).send(error.message);
    };

})


//post bookreview

router.post('/postreview',Authenticate,cors(corsOptions),async function(req,res){

    const uid = req.rootUser.fname;

    const review = req.body.review;
    const rating = req.body.rating;
    const bookid = req.body.bookid;
   

    
    const date = new Date();

    try{
        const teams = await Book.findOne({ _id:bookid });

        
   
        const status=   await Book.updateOne({ _id:bookid },{$push: {reviews: {uid:uid, review:review,rating:rating,date:date,}}})
        res.status(200).send({ "message": "Review added" });

      
        /*const reviewdata = new Review({ uid:uid, review,rating, bookid,date });
        reviewdata.save(async (err, data) => {
            if (err) throw err;
            return res.json({'mes': 'review saved'})
        })*/
    }catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    };

})


//get your team

router.get('/getyourbooks', Authenticate,cors(corsOptions), async (req, res) => {

    const _id = req.rootUser._id;

    try {

        const yourbooks = await Book.find({ userid: _id })

        console.log(yourbooks );

        return res.status(200).json(yourbooks )

    } catch (error) {

        console.log(error)

        res.status(500).send(error.message);

    }

})
router.post("/contact",cors(corsOptions),  (req, res) => {

    const { name, email, phone, message } = req.body;
  
    try {
  
   
  
      const resdata = new Contact({ name, email, phone, message });
  
      resdata.save(async (err, data) => {
  
        if (err) throw err;
  
        return res.json({
  
          'mes': 'difficulty saved'
  
        })
  
      })
  
   
  
   
  
    } catch {
  
   
  
    }
  
  })


  module.exports = router ; 