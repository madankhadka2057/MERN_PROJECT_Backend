const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");

exports.addToCart = async (req, res) => {
  //userId,prductId
  const userId = req.user.id;
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({
      message: "Please provide ProductId",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    res.status(404).json({
      message: "Product not found with this productId",
    });
  }
  const user = await User.findById(userId);
  user.cart.push(productId);
  await user.save();
  res.status(200).json({
    message: "product added to cart",
  });
};
