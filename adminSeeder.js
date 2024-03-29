const User = require("./model/userModel");
const bcrypt=require("bcryptjs")
const adminSeeder=async()=>{
    //admin seeding
   const data={
    userEmail: "madankhadka2057@gmail.com",
    role: "admin",
   }
  //check whether admin exist or not
  const isAdminExist = await User.findOne(data);
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