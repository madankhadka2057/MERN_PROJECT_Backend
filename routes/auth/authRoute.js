const { registerUser, loginUser, forgetUser, verifyOtp, resetPassword } = require("../../controller/auth/authcontroller")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router=require("express").Router()
router.route("/register").post(catchAsync(registerUser))//catchAsync is for error handling
router.route("/login").post(catchAsync(loginUser))
router.route("/forgetPassword").post(catchAsync(forgetUser))
router.route("/verifyOtp").post(catchAsync(verifyOtp))
router.route("/resetPassword").post(catchAsync(resetPassword))
module.exports=router