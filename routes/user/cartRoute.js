const { addToCart } = require("../../controller/user/cart/cartController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router=require("express").Router()
router.route("/cart/:productId").post(isAuthenticated,catchAsync(addToCart))

module.exports=router