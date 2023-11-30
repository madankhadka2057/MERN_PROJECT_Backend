const express=require("express")
const app=express();
const cors=require("cors");
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./uploads"))//give access to see this folder throw url.static("./")for access all folders
const { createConnection } = require("./database/database");
app.use(cors())
require('dotenv').config();
const PORT=process.env.PORT;
createConnection(process.env.MONGO_URL);
require('./model/userModel')
const { registerUser, loginUser, forgetUser } = require("./controller/auth/authcontroller");
//routes here
const authRoute=require("./routes/auth/authRoute")
const productRoute=require("./routes/admin/productRoute")
const adminUserRoute=require('./routes/admin/adminUsersRoute')
const userReviewsRoute=require("./routes/user/userReviewsRoute")
const profileRoute=require("./routes/user/profileRoute")
app.get("/",(req,res)=>{
    res.json({
        code:2000,
        message:"I am activate"
    })
})
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/admin",adminUserRoute)
app.use("/api/reviews",userReviewsRoute)
app.use("/api/profile",profileRoute)
// app.post("/register",registerUser)//register user api
// app.post("/login",loginUser)//login api
// app.post("/forgetPassword",forgetUser)//forget password api





app.listen(PORT,()=>{
    console.log(`Port is running at port ${PORT}`)
})