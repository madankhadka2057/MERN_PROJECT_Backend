const User = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const tokenVerify=async(token)=>{
    const decoded = await promisify(jwt.verify)(token, process.env.secretKey);
    if (!decoded) {
    console.log("Please don't do this")
    }
   
   //  check id decoded.id(userId)exists in th user table
    try {
      const doesUserExist = await User.findOne({_id:decoded.id});
      if (doesUserExist) {
          return doesUserExist;
      } else {
          console.log("No user found");
      }
  } catch (error) {
      console.error("Error finding user:", error);
  }
  
}
module.exports=tokenVerify