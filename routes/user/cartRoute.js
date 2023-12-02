const { addToCart, getMyCartItems, deleteItemFromCart } = require("../../controller/user/cart/cartController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router=require("express").Router()
router.route("/:productId").post(isAuthenticated,catchAsync(addToCart)).delete(isAuthenticated,catchAsync(deleteItemFromCart))
router.route("/").get(isAuthenticated,catchAsync(getMyCartItems))

module.exports=router