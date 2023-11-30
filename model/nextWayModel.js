const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A review must blong to user"],
  },
  rating: {
    type: Number,
    required: true,
    default: 3,
  },
  message: String,
});
const NextWayReview = mongoose.model("NextWayReview", reviewSchema);
module.exports = {
  NextWayReview,
  reviewSchema,
};
