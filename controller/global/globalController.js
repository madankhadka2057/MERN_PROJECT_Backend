const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");

//find allProduct!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
exports.getProducts = async (req, res) => {
  const products = await Product.find(); /*.populate({
      path:"reviews",
      populate:{
        path:"userId",
        select:"userName userEmail"
      }
    })*/
  if (products.length == 0) {
    res.status(400).json({
      message: "No product Found",
      data: [],
    });
  } else {
    res.status(200).json({
      message: "Product Fatched Successfully",
      data: products,
    });
  }
};
//find singlePproduct!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id(productId)",
    });
  }
  const product = await Product.find({ _id: id });
  const productReviews = await Review.find({ productId: id }).populate(
    "userId"
  );
  if (product.length == 0) {
    res.status(400).json({
      message: "No product found with that id",
      data:{
        data: [],
        data2: []
      }
    });
  } else {
    res.status(200).json({
      message: "product fatched successfully",
      data: { product, productReviews },
    });
  }
};
