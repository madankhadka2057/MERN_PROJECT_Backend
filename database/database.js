const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");
exports.createConnection = async (URL) => {
  await mongoose.connect(URL);
  console.log("Database Connected Successfully");
  //admin seeding function
  adminSeeder()
};
