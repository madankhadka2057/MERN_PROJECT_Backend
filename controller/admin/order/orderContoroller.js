const Order = require("../../../model/orderSchema");

//get All order of user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate({
    path: "items.product",
    model: "Product",
  });
  if (orders.length == 0) {
    return res.status(404).json({
      message: "No orders found",
      data: [],
    });
  }
  res.status(200).json({
    message: "Orders Fetched Successfully",
    data: orders,
  });
};
//only get order of single user !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getSingleOrder=async(req,res)=>{
  const {id}=req.params;
  //check if order exist or not
  const order=await Order.findById(id)
  if(!order){
    return res.status(404).json({
      message:"No order found with that id",
    })
  }
  res.status(200).json({
    message:"Order fetched sucessfully",
    data:order
  })
};

//update order status of user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.updateOrderStatus=async(req,res)=>{
  const {id}=req.params
  const {orderStatus}=req.body

  if(!orderStatus||! ["Pending", "Delivered", "Cancelled", "Ontheway", "Preparation"].includes(orderStatus.toLowerCase())){
    return res.status(400).json({
      message:"Order status is invalide or should be provided"
    })
  }
  const order=await Order.findById(id)
  if(!order){
    return res.status(404).json({
      message:"No order found with that id",
    })
  }
  const updatedOrder=await Order.findByIdAndUpdate(id,{
    orderStatus
  },{new:true})
  res.status(200).json({
    message:"Order sytatus updated successsfully",
    data:updatedOrder
  })
}
//delete order!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.deleteOrder=async(req,res)=>{
  const {id}=req.params
  const order=await Order.findById(id)
  if(!order){
    return res.status(404).json({
      message:"No order found with that id",
    })
  }
  await Order.findByIdAndDelete(id)
  res.status(200).json({
    message:"Order deleted Successfully",
    data:null
  })
}