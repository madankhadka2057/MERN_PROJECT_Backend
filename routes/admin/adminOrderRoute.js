const { getAllOrders, getSingleOrder, updateOrderStatus, deleteOrder, updatePaymentStatus } = require("../../controller/admin/order/orderContoroller")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router=require("express").Router()


router.route("/").get(isAuthenticated,restrictTo("admin"),catchAsync(getAllOrders))
router.route("/paymentStatus/:id").patch(isAuthenticated,restrictTo("admin"),catchAsync(updatePaymentStatus))
router.route("/:id").get(isAuthenticated,restrictTo("admin"),catchAsync(getSingleOrder)).patch(isAuthenticated,restrictTo("admin"),catchAsync(updateOrderStatus)).delete(isAuthenticated,restrictTo("admin"),catchAsync(deleteOrder))

module.exports=router