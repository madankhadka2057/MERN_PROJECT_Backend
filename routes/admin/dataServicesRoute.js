const DataServiceObj = require("../../controller/admin/misc/dataServices")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router=require("express").Router()

router.route("/misc/dataServices").get(isAuthenticated,restrictTo("admin"),catchAsync(DataServiceObj.getDatas))

module.exports=router