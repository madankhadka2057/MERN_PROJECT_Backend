const User = require("./model/userModel");
const bcrypt=require("bcryptjs")
const adminSeeder=async()=>{
    //admin seeding

  //check whether admin exist or not
  const isAdminExist = await User.findOne({
    userEmail: "madankhadka2057@gmail.com",
    role: "admin",
  });
  if (!isAdminExist) {
    await User.create({
      userEmail: "madankhadka2057@gmail.com",
      userPassword: bcrypt.hashSync("admin",10),
      userPhoneNumber: "9867365986",
      userName: "admin",
      role: "admin",
    });
    console.log("Admin seeded successfully");
  }else{
    console.log("Admin already sheeded")
  }
}
module.exports=adminSeeder