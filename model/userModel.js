const mongoose=require("mongoose")
const Schema=mongoose.Schema

const userSchema=mongoose.Schema({
    userEmail:{
        type:String,
        required:[true,"Email must be required"],
        lowercase:true
    },
    userPhoneNumber:{
        type:Number,
        required:[true,"Phone num must be required"]
    },
    userName:{
        type:String,
        required:[true,"Name  must be required"]
    },
    userPassword:{
        type:String,
        required:[true,"Password must be required"]
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
    otp:{
        type:Number,
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    }
})
const User=mongoose.model("User",userSchema)
module.exports=User