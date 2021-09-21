const express = require('express');
const multer = require("multer");
const BookData = require('./src/model/BookData');
const AuthorData = require('./src/model/AuthorData');
const SignupData = require('./src/model/SignupData');
const path = require("path");  
//Cross origin resource sharing
const cors = require('cors');
var bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
var app = new express();
//app.use(express.static('./public'));
app.use("/images", express.static(path.join("backend/images")));  
app.use(cors());
app.use(express.json());
username="admin@ictak.in";
passwords="Abcd123@";
roles="";
  var Storage=multer.diskStorage({
      destination:"./public/images/",
      filename:(req,file,cb)=>{
          cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
      }
  });
  var upload = multer({ 
      storage:Storage
   }).single('image')
   function verifyToken(req,res,next){
    if(!req.headers.authorization){
       return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token=='null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token,'secretKey')
    
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.userId= payload.subject
    next()
    }
   app.post('/login',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    email=req.body.email;
    password=req.body.password;
    if(username==email && passwords==password){
        let payload={subject:email+password};
        let token=jwt.sign(payload,'secretKey');
        let role="admin"
        res.status(200).send({token,role});
    }
    else {
    SignupData.findOne({email:email,password:password}, function (err, user) {
        if(!user){
            res.status(401).send('Email and Password dont match') 
        }
        else {
            let role=user.role;
            console.log(role);
            let payload={subject:email+password};
            let token=jwt.sign(payload,'secretKey');
            res.status(200).send({token,role});
        }
    });
}
   })
app.get('/books',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    BookData.find()
    .then(function(books){
        res.send(books);
    });
});
app.get('/authors',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    AuthorData.find()
    .then(function(authors){
        res.send(authors);
    });
});
app.post('/newbook',upload,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    var book=
        {
            title: req.body.book.title,
            author: req.body.book.author,
            genre: req.body.book.genre,
            synopsis: req.body.book.synopsis,
            image: req.body.book.image,
            imagepath: req.body.book.imagepath
        }
    var book = new BookData(book);
    book.save();
});
app.post('/newauthor',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    var author=
        {
            author: req.body.author.author,
            book: req.body.author.book,
            genre: req.body.author.genre,
            info: req.body.author.info,
            image: req.body.author.image,
            imagepath: req.body.author.imagepath
        }
    var author = new AuthorData(author);
    author.save();
});
app.post('/signup',function(req,res){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
  if(req.body.signup.email=="admin@ictak.in" && req.body.signup.password=="Abcd123@"){
 roles="admin"
  }
  else{
       roles=''
  }
  var signup=
      {
          fname:req.body.signup.fname,
          lname:req.body.signup.lname,
          mobnumber:req.body.signup.mobnumber,
         email:req.body.signup.email,
         password:req.body.signup.password,
         confirmpwd:req.body.signup.confirmpwd,
         role:roles
      }
      email=req.body.signup.email;
      SignupData.findOne({email:email}, function (err, user) {
        if (user) {
            res.status(401).send('Email already exists')   
        }
        else{
             signup = new SignupData(signup);
            signup.save();
            console.log(req.body);
            res.status(200).send();
        }
      })
});
app.get('/:id',  (req, res) => {
    const id = req.params.id;
     BookData.findOne({"_id":id})
      .then((book)=>{
          res.send(book);
      });
  })
  app.get('/author/:id',  (req, res) => {
    const id = req.params.id;
   
    AuthorData.findOne({"_id":id})
      .then((author)=>{
          res.send(author);
      });
  })
  app.put('/update',(req,res)=>{
    id=req.body._id,
    title= req.body.title,
    author= req.body.author,
    genre= req.body.genre,
    synopsis= req.body.synopsis,
    image= req.body.image,
    imagepath= req.body.imagepath
  BookData.findByIdAndUpdate({"_id":id},
                                {$set:{ "title": req.body.title,
                                    "author": req.body.author,
                                    "genre": req.body.genre,
                                    "synopsis": req.body.synopsis,
                                    "image": req.body.image,
                                    "imagepath": req.body.imagepath}})
   .then(function(){
       res.send();
   })
 })
 app.put('/updateauthor',(req,res)=>{
    id=req.body._id,
    author= req.body.author,
    book= req.body.book,
    genre= req.body.genre,
   info= req.body.info,
    image= req.body.image,
    imagepath= req.body.imagepath
   AuthorData.findByIdAndUpdate({"_id":id},
                                {$set:{ "author": req.body.author,
                                    "book": req.body.book,
                                    "genre": req.body.genre,
                                    "info": req.body.info,
                                    "image": req.body.image,
                                    "imagepath": req.body.imagepath}})
   .then(function(){
       res.send();
   })
 })
 app.delete('/removebook/:id',(req,res)=>{
    console.log("sucess")
    id = req.params.id;
    BookData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })
  app.delete('/removeauthor/:id',(req,res)=>{
    id = req.params.id;
    AuthorData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })
app.listen(5100);