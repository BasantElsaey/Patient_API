/**
 * postman
 * Signup -- token -- headers key:value Authorization: Bearer token
 * login -- token -- headers key:value Authorization: Bearer token
 */
const jwt = require('jsonwebtoken')
const Patient = require('../models/Patient')

const auth = async (req,res,next)=>{
    try{
    // req.header --> token 
    // console.log('Auth middelware')
    const token = req.header('Authorization').replace('Bearer ','')
    //console.log(token)
    // nodeAPI --> comes from user.js file (model) in sign function jwt
    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
   // console.log(decode)
    const user = await Patient.findById({_id:decode._id})
  // console.log(user)
    
    req.patient = user
    next()
    
}
catch(e){
    res.send({error:'Please authenticate'})
}
}
module.exports = auth