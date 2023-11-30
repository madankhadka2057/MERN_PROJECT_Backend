const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/userModel");
const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({
      message: "Please send token",
    });
  }
  //if token is present
  // verify if the token is legit or not
  // jwt.verify(token,process.env.secretKey,(err,success)=>{
  //     if(err){
  //         res.status(400).json({
  //             message:"Invalid Token"
  //         })
  //     }else{
  //         res.status(200).json({
  //             message:"Valid Token"
  //         })
  //     }
  // })
  //Alternative
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.secretKey);
    if (!decoded) {
      return res.status.json({
        message: "Don't try to this",
      });
    }
    //check id decoded.id(userId)exists in th user table
    const doesUserExist = await User.findOne({ _id: decoded.id });
    if (!doesUserExist) {
      return res.status(404).json({
        message: "User doesn't eist with that token/id",
      });
    }
    req.user = doesUserExist;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = isAuthenticated;
