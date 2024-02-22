const Order = require("../../../model/orderSchema");
const Product = require("../../../model/productModel");

//get All order of user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate({
    path: "items.product",
    model: "Product",
  }).populate('user');
  if (orders.length == 0) {
    return res.status(404).json({
      message: "No orders found",
      data: [],
    });
  }
  // console.log(orders)
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

  if(!orderStatus||! ["pending", "delivered", "cancelled", "ontheway", "preparation"].includes(orderStatus.toLowerCase())){
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
  },{new:true}).populate({
    path: "items.product",
    model: "Product",
  }).populate('user');
  let newdata
  if(orderStatus==="Delivered"){
    newdata=updatedOrder.items.map((items)=>{

      return{ 
        quantity:items.quantity,
        productStockQty:items.product.productStockQty,
        productId:items.product._id
      }
    })
    for(var i=0; i<newdata.length; i++){
      console.log(newdata[i].productStockQty,newdata[i].quantity)
      await Product.findByIdAndUpdate(newdata[0].productId,{
        productStockQty:newdata[i].productStockQty-newdata[i].quantity
      })
    }
    
  }
  
  res.status(200).json({
    message:"Order sytatus updated successsfully",
    data:updatedOrder,
  })
}
//update payment status
exports.updatePaymentStatus=async(req,res)=>{
  const {id}=req.params
  const {paymentStatus}=req.body
  if(!paymentStatus||! ["success", "paid", "failed", "pending"].includes(paymentStatus.toLowerCase())){
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
  const updatedPaymentOrder=await Order.findByIdAndUpdate(id,{
    'paymentDetails.status':paymentStatus
  },{new:true}).populate({
    path: "items.product",
    model: "Product",
  }).populate('user');
  res.status(200).json({
    message:"Order Payment updated successsfully",
    data:updatedPaymentOrder
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