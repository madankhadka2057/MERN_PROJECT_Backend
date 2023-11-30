const User = require("../../../model/userModel");
exports.getUsers = async (req, res) => {
  const currentUserId = req.user._id;
  // Fetch all users except the current user
  const users = await User.find({ _id: { $ne: currentUserId } });
  if (users.length > 0) {
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } else {
    res.status(404).json({
      message: "User collection is empty",
      data: [],
    });
  }
};
//deleteUser !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.deleteUser=async(req,res)=>{
  const userId=req.params.id
  if(!userId){
    return res.status(400).json({
      message:"Please Provide userID"
    })
  }
  //check if tat userid exist or not
  const user=await User.findById(userId)
  if(!user){
    res.status(404).json({
      message:"User not find with that userId"
    })
  }else{
    await User.findByIdAndDelete(userId)
    res.status(200).json({
      message:"User deleted successfuly"
    })
  }
}
