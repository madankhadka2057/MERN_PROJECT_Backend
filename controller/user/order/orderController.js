const Order = require("../../../model/orderSchema");
const User = require("../../../model/userModel");

//create Order!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.createOrder = async (req, res) => {
  const userId = req.user._id;
  // console.log(req.body);
  //   return
  const { shoppingAddress, items, totalAmount, paymentDetails,phoneNumber } = req.body;
  if (!shoppingAddress || !items || !totalAmount || !paymentDetails||!phoneNumber) {
    return res.status(400).json({
      message:
        "Please provide shoppingAddress,items,totalAmount,paymentDetails,phoneNumber",
    });
  }
 const createOrder= await Order.create({
    user: userId,
    shoppingAddress,
    items,
    totalAmount,
    paymentDetails,
    phoneNumber
  });
  // console.log("userId from createOrder",userId)
  const user=await User.findById(userId)
  user.cart=[]
  await user.save()
  // console.log("hello",user)
  res.status(200).json({
    data:createOrder,
    message: "Order created successfully",
  });
};
//get My order only!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getMyOrders = async (req, res) => {
  
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).populate({
    path: "items.product",
    model: "Product",
    select:
      "-productStockQty -createdAt -updatedAt -reviews -__v -paymentDetails ",
  });
  console.log("My orders",orders)
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
//update order!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.updateMyOrder = async (req, res) => {
    const userId=req.user.id
  const { id } = req.params;//order id
  const { shoppingAddress, items } = req.body;
  if(!shoppingAddress||!items){
    return res.status(400).json({
        message:"Please provide shoppingAddress,items"
    })
  }
  //get order of aode id
  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    return res.status(404).json({
      message: "No order with that id",
    });
  }
  //check if the trying to update user is true ordered User
  if(existingOrder.user!==userId){
    return res.status(403).json({
        message:"You don't have permission to update this order "
    })
  }
  if(existingOrder.orderStatus!=="Pending"){
      return res.status(400).json({
          message:"You can't update this order it is not Pending"
      })
  }
  if (existingOrder.orderStatus == "Ontheway") {
    return res.status(400).json({
      message: "You cannot update order when it is on the way",
    });
  }
  const updatedOrder=await Order.findByIdAndUpdate(id,{shoppingAddress,items},{new:true});
  res.status(200).json({
    message:"Order updated Successfully",
    data:updatedOrder
  })
};

//delete order!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.deleteMyOrder=async(req,res)=>{
    const userId=req.user._id
    const {id}=req.params
    //check if order exists or not
    const order=await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message:"No order with that id"
        })
    }
    console.log(userId)
    if(order.user.toString()!==userId.toString()){
       
        return res.status(400).json({
            message:"You don't have permission to delete this order"
        })
    }
    if([ "Delivered","Ontheway","Preparation"].includes(order.orderStatus)){
      console.log(order.orderStatus)
        return res.status(400).json({
            message:"Hey!!! You can't delete this order it is not Pending"
        })
    }
    await Order.findByIdAndDelete(id)
    res.status(200).json({
        message:"Your order deleted successfully",
        data:null
    })
}

//cancel order!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.cancelOrder=async(req,res)=>{
    const {id}=req.body
    const userId=req.user.id    
    //check if order exists or not
    const order=await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message:"No order with that id"
        })
    }
    if(order.user!=userId){
      // console.log("Mdn",order.user,userId)
        return res.status(400).json({
            message:"You don't have permission to cancelled this order"
        })
    }
    if(order.orderStatus!=="Pending"){
      console.log(order)
        return res.status(400).json({
            message:"You can't cancel this order it is not Pending"
        })
    }
    await Order.findByIdAndUpdate(id,{
        orderStatus:"cancelled"
    })
    res.status(200).json({
        message:"Order cancelled Successfully"
    })
}
