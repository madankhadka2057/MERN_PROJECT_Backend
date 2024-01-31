const { initiateKhaltiPayment, verifyPidx } = require("../../controller/user/payment/paymentContorller")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router=require("express").Router()


router.route("/").post(isAuthenticated,catchAsync(initiateKhaltiPayment))
router.route("/verifypidx").post(isAuthenticated,catchAsync(verifyPidx))

module.exports=router
