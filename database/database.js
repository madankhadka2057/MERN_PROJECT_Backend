const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");
exports.createConnection = async (URL) => {
  try {
    // console.log(URL)
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
    //admin seeding function
    adminSeeder();
  } catch (err) {
    console.log("Error occurred: ", err);
  }
};
