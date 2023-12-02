const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");
//addItems to the cart!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
//get All cart items !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getMyCartItems = async (req, res) => {
  const userId = req.user.id;
  const userData = await User.findById(userId).populate({
    path: "cart",
    select: "-productStatus -productName",
  });
  res.status(200).json({
    message: "Cart fatched successfully",
    data: userData.cart,
  });
};
//delete items from cart!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.deleteItemFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  // const { productIds } = req.body;
  //check if that product is exists or not
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "No product with that productId",
    });
  }
  //get user cart
  const user = await User.findById(userId);
  user.cart = user.cart.filter (pId => //[1,2,3]==>2==>filter==>[1,3]==>user.cart=[1,3]
         pId != productId)
  // productIds.forEach(productIdd => {
  //   user.cart = user.cart.filter((pId) => {//[1,2,3]==>2==>filter==>[1,3]==>user.cart=[1,3]
  //     pId != productIdd;
  //   });
  // });
 
  await user.save();
  res.status(200).json({
    message: "Items removed form cart",
  });
};
