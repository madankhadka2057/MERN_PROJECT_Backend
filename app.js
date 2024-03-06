#!/usr/bin / env node

const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./uploads")); //give access to see this folder throw url.static("./")for access all folders
const { createConnection } = require("./database/database");

const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { Server } = require("socket.io");

app.use(
  cors({
    origin: "*",
  })
);
require("dotenv").config();
const PORT = process.env.PORT;
createConnection(process.env.MONGO_URL);
require("./model/userModel");
//routes here
const authRoute = require("./routes/auth/authRoute");
const productRoute = require("./routes/admin/productRoute");
const adminUserRoute = require("./routes/admin/adminUsersRoute");
const userReviewsRoute = require("./routes/user/userReviewsRoute");
const profileRoute = require("./routes/user/profileRoute");
const cartRoute = require("./routes/user/cartRoute");
const orderRoute = require("./routes/user/orderRoute");
const adminOrderRoute = require("./routes/admin/adminOrderRoute");
const paymentRoute = require("./routes/user/paymentRoute");
const dataServicesRoute = require("./routes/admin/dataServicesRoute");
const tokenVerify = require("./controller/global/tokenVerify");
const User = require("./model/userModel");
app.get("/", (req, res) => {
  res.json({
    code: 2000,
    message: "I am activate",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/admin", adminUserRoute);
app.use("/api/reviews", userReviewsRoute);
app.use("/api/profile", profileRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/admin", dataServicesRoute);

const server = app.listen(PORT, () => {
  console.log(`Port is running at port ${PORT}`);
});

const io = new Server(server, {
  cors: "http://localhost:3001/",
});

let onlineUsers = [];

const addToOnlineUsers = (socketId, userId, role) => {
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
  onlineUsers.push({ socketId, userId, role });
  console.log(onlineUsers);
};

io.on("connection", async (socket) => {
  // take the token and validate it
  const { token } = socket.handshake.auth;
  if (token) {
    // validate the token
    doesUserExist=await tokenVerify(token)
    if (doesUserExist) {
      addToOnlineUsers(socket.id, doesUserExist.id, doesUserExist.role);
    }
  }
  socket.on("changeOrderStatus", ({ status, orderId, userId }) => {
    const findUser = onlineUsers.find((user) => {
      return user.userId == userId;
    });
    if (findUser) {
      io.to(findUser.socketId).emit("statusUpdated", {
        status: status,
        orderId: orderId,
      });

     
    } else {
      console.log("User doesnt exist");
    }
  });

  socket.on("changePaymentStatus", ({ status, orderId, userId }) => {
    const findUser = onlineUsers.find((user) => {
      return user.userId == userId;
    });
    if (findUser) {
      io.to(findUser.socketId).emit("paymentUpdated", {
        status: status,
        orderId: orderId,
      });

     
    } else {
      console.log("User doesnt exist");
    }
  });
});
// let onlineUsers=[]
// const addOnlineUsers=(socketId,userId,role)=>{
//      const userExist=onlineUsers.filter((user)=>{
//         console.log(user.userId.equals(userId))
//         console.log(user.userId,userId)
//         return user.userId.equals(userId)
//      })
//      console.log("existing user",userExist)
//      if(userExist.length==0){
//          onlineUsers.push({socketId,userId,role})
//      }
//     console.log("new user",onlineUsers)
// }
// io.on("connection",async(socket)=>{
//    const token=socket.handshake.auth.token
// //    console.log(token)
//     let activeUser
//     if(token){
//         activeUser=await tokenVerify(token)
//     }
//     if(activeUser){
//         addOnlineUsers(socket.id,activeUser._id,activeUser.role)
//     }
//   socket.on("changeOrderStatus",({status,orderId,userId})=>{
//     const findUser=onlineUsers.find((user)=>{

//         return user.userId==userId
//     })
//    if(findUser){
//         console.log("Find User",findUser)
//         io.to(findUser.socketId).emit("statusUpdated",{status:status,orderId:orderId})
//    }else{
//         console.log("User doesnt exist")
//    }
//   })
// })
