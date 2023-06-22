const BookModel = require('../models/bookModel');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const authenticationMid = function (req, res, next) {
    try { 
      let token = req.headers["x-api-key"]; 
      if (!token)
        return res.status(400).send({ status: false, msg: "token must be present" });
   
      const decodedToken=jwt.verify(token, "BookManagement");
      if(!decodedToken){
          return res.status(400).send({status:false,msg:"token is invalid"})
      } 
      req.decodedToken=decodedToken._id; 
      next(); 
    } catch (error) { 
      return res.status(500).send({ status: false, msg:error.message });
    }
  }

  const authorizationMid = async function (req,res,next){
    try{
        const bookId = req.params.bookId;
        if(!bookId){
            return res.status(400).send({ status: false, msg: "bookId must be present" });
        }
       const book = await BookModel.findById(bookId);
       if(!book){
        return res.status(404).send({ status: false, msg: "book not found"});
       }
       if(req.decodedToken!=book.userId){
        return res.status(403).send({ status: false, msg: "login user is not allowed "});
       }
next();
    }catch(error){
      return res.status(500).send({ status: false, msg:error.message });
  
  }
  }
  const authorizationMidd = async function (req,res,next){
    try{
        const userId = req.body.userId;
        if(!userId){
            return res.status(400).send({ status: false, msg: "userId must be present" });
        }
       if(req.decodedToken!=userId){
        return res.status(403).send({ status: false, msg: "login user is not allowed "});
       }
next();
    }catch(error){
      return res.status(500).send({ status: false, msg:error.message });
  
  }
  }
  module.exports = {authenticationMid,authorizationMid,authorizationMidd};