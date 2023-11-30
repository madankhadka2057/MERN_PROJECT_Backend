
const { getProductReview, getMyReview, deleteReview, createReview } = require("../../controller/user/review/reviewController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router
  .route("/")
  .get(isAuthenticated, catchAsync(getMyReview));
router
  .route("/:id")
  .get(isAuthenticated, catchAsync(getProductReview))
  .delete(isAuthenticated, catchAsync(deleteReview))
  .post(isAuthenticated, catchAsync(createReview));
// .post(isAuthenticated, catchAsync(addProductReview));

module.exports = router;
