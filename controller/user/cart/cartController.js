const ObjectId = require('mongodb').ObjectId;
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
  
  const existingCartItem = user.cart.find((item) => item.product && item.product.equals(new ObjectId(productId)));
  if(existingCartItem){
    existingCartItem.quantity+=1
  }else{
    user.cart.push({
      product:productId,
      quantity:1
    })
  }
  await user.save()
  const updatedUser=await User.findById(userId).populate('cart.product')
  res.status(200).json({
    data:updatedUser.cart,
    message: "product added to cart",
  });
};
//get All cart items !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getMyCartItems = async (req, res) => {
  const userId = req.user.id;
  const userData = await User.findById(userId).populate({
    path: "cart.product",
    select: "-productStatus ",
  });

  res.status(200).json({
    message: "My Cart fatched successfully",
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

  user.cart = user.cart.filter((item) => !item.product.equals(new ObjectId(productId)));
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

//update cartItems
exports.updateCartItem=async(req,res)=>{
  const userId = req.user.id;
  const {productId}=req.params
  const {quantity}=req.body
  
  const user=await User.findById(userId)
  const existingCartItem = user.cart.find((item) => item.product && item.product.equals(new ObjectId(productId)));
  if(!existingCartItem){
    console.log("No data found with this id")
  }else{
    existingCartItem.quantity=quantity
  }
  user.save();
  res.status(200).json({
    message:" Cart Items Successfully ",
    data:user.cart
  })
}