const jwt = require('jsonwebtoken');
const validator= require('validator');
const userModel = require('../models/userModel');

const registerUser = async function (req, res) {
    try {
        const requestBody = req.body;
        const createData = await userModel.create(requestBody);
        res.status(201).send({ status: true, data: createData })
    }
    catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email||!password) {
      return res.status(400).json({status:false, message:"Invalid email or password"});
    }

    if(email.trim().length==0 ||!(password.trim().length<=15 && password.trim().length>=8) ||!validator.isEmail(email)){
      return res.status(400).json({status:false,message: 'Invalid email or password'});
    }

    const regEmail = await userModel.findOne({ email: email });

    if (!regEmail) {
      return res.status(404).json({ status: false, message: "Email not found" });
    }

    if (regEmail.password !== password) {
      return res.status(401).json({ status: false, message: "Password is incorrect" });
    }

    const token = jwt.sign({ _id: regEmail._id }, "BookManagement", {
      expiresIn: '24h' // Token expiration time (optional)
    });
    
    res.setHeader('x-api-key',token);

    return res.status(200).json({ status: true, data:{token: token }});
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { registerUser,login };