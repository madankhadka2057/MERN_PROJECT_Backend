const User = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const sendEmail = require("../../services/sendEmail");
//register user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.registerUser = async (req, res) => {
  const { email, password, phoneNumber, username } = req.body;
  if (!email || !password || !phoneNumber || !username) {
    return res.status(400).json({
      message: "Please send email,password or phoneNumber",
    });
  }
  //check if that email user already exist or not
  userFound = await User.find({ userEmail: email });
  if (userFound.length > 0) {
    return res.status(400).json({
      message: "User with this email already registred",
    });
  }
  const userData=await User.create({
    userName: username,
    userPhoneNumber: phoneNumber,
    userEmail: email,
    userPassword: bcrypt.hashSync(password, 10),
  });
  res.status(201).json({
    message: "Successfully Registered",
    data:userData
  });
};
//login user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "please enter email and password",
    });
  }
  const userFound = await User.find({ userEmail: email });
  if (userFound.length == 0) {
    return res.status(404).json({
      message: "User with this email is not registred",
    });
  }
  // console.log(userFound[0].userPassword)
  const isMatch = bcrypt.compareSync(password, userFound[0].userPassword);
  if (isMatch) {
    //generate token
    const token = jwt.sign({ id: userFound[0]._id }, process.env.secretKey, {
      expiresIn: "30d",
    });

    res.status(200).json({
      data:userFound,
      message: "User logged in successfully",
      token:token,
    });
  } else {
    res.status(404).json({
      message: "invalid password",
    });
  }
};
//forget password!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.forgetUser=async(req,res)=>{
    const {email}=req.body;
    if(!email){
       return res.status(400).json({
            message:"Please enter your email"
        })
    }
    const userExist=await User.find({userEmail:email})
    if(userExist.length==0){
        return res.status(404).json({
        message:"User is not registered"
        })
    }
        //send otp to that email
        const otp=Math.floor(1000+Math.random()*9000)
        userExist[0].otp=otp
        await userExist[0].save()
        await sendEmail({
            email:userExist[0].userEmail,
            subject:'ForgetPassword',
            message:`your otp is:-${otp}`,
        })
        res.json({
            message:"Otp sent successfully",
            data:userExist[0].userEmail
        })
}
//verify otp!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.verifyOtp=async(req,res)=>{
  const {email,otp}=req.body
  if(!email||!otp){
    return res.status(400).json({
      message:"Please provide email or otp"
    })
  }
  //check if that otp is correct or not of that email
  const userExist=await User.find({userEmail:email})
  if(userExist.length==0){
    return res.status(404).json({
      message:"Email is not registered"
    })
  }
  if(userExist[0].otp!==otp){
    return res.status(400).json({
      message:"Invalid otp"
    })
  }
  //dispost the otp so cannot be used next time the same otp
  userExist[0].otp=undefined;
  userExist[0].isOtpVerified=true
  await userExist[0].save()
  res.status(200).json({
    message:"otp is correct"
  })
}

exports.resetPassword=async(req,res)=>{
  const {email,newPassword,confirmPassword}=req.body
  if(!email||!newPassword||!confirmPassword){
    return res.status(400).json({
      message:"Please enter email or password"
    })
  }
  if(newPassword!==confirmPassword){
    return res.status(400).json({
      message:"Password doesn't match "
    })
  }
  const userExist=await User.find({userEmail:email})
    if(userExist.length==0){
      return res.status(404).json({
        message:"user email not registered"
      })
    }
    const comparePassword=bcrypt.compareSync(newPassword, userExist[0].userPassword);
    if(comparePassword){
      return res.status(404).json({
        message:"You can't set old password as new password"
      })
    }
    if(userExist[0].isOtpVerified!==true){
      return res.json({
        message:"You can't perform Multiple time this process"
      })
    }
    userExist[0].userPassword=bcrypt.hashSync(newPassword,10)
    userExist[0].isOtpVerified=false
    await userExist[0].save()

    res.status(200).json({
      message:"password have been changed successfully"
    })
}