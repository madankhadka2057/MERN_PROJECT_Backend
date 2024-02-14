import { SpeedInsights } from "@vercel/speed-insights/next"
const express=require("express")
const app=express();
const cors=require("cors");
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./uploads"))//give access to see this folder throw url.static("./")for access all folders
const { createConnection } = require("./database/database");
app.use(cors({
    origin:'*'
}))
require('dotenv').config();
const PORT=process.env.PORT;
createConnection(process.env.MONGO_URL);
require('./model/userModel')
//routes here
const authRoute=require("./routes/auth/authRoute")
const productRoute=require("./routes/admin/productRoute")
const adminUserRoute=require('./routes/admin/adminUsersRoute')
const userReviewsRoute=require("./routes/user/userReviewsRoute")
const profileRoute=require("./routes/user/profileRoute")
const cartRoute=require("./routes/user/cartRoute")
const orderRoute=require("./routes/user/orderRoute")
const adminOrderRoute=require("./routes/admin/adminOrderRoute")
const paymentRoute=require('./routes/user/paymentRoute')
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
app.use("/api/cart",cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/orders",adminOrderRoute)
app.use("/api/payment",paymentRoute)
// app.use("/api/order",orderRoute)
// app.post("/register",registerUser)//register user api
// app.post("/login",loginUser)//login api
// app.post("/forgetPassword",forgetUser)//forget password api
app.listen(PORT,()=>{
    console.log(`Port is running at port ${PORT}`)
})