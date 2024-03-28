const axios = require("axios");
const Order = require("../../../model/orderSchema");
const User = require("../../../model/userModel");
exports.initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Please provide orderId and Amount",
    });
  }
  let order=await Order.findById(orderId)
  if(!order){
    return res.status(404).json({
      message:"Order is not found with this id"
    })
  }
  if(order.totalAmount!==amount){
    res.status(400).json({
      message:"Please provide full payment"
    })
  }
  const data = {
    return_url: "https://onlinefood-kfmlpw8hk-madankhadka2057s-projects.vercel.app/success",
    website_url: "https://foodorder-8jma.onrender.com",
    amount: amount*100,
    purchase_order_id: orderId,
    purchase_order_name: "Madan Khadka" + orderId,
  };

  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    data,
    {
      headers: {
        Authorization: "key a0b6539a02d5439f942d301a8fd1e4a8",
      },
    }
  );

  order=await Order.findById(orderId)
  order.paymentDetails.pidx=response.data.pidx
  await order.save()
  
  res.status(200).json({
    message:"Payment Successfull",
    payment_url:response.data.payment_url
  })
};

exports.verifyPidx = async (req, res) => {
  console.log("Verifying Payment")
  const userId=req.user.id
  const pidx= req.body.pidx
  console.log(userId, pidx)
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx: pidx },
    {
      headers: {
        Authorization: "key a0b6539a02d5439f942d301a8fd1e4a8",
      },
    }
  );
  if (response.data.status == "Completed") {
    //modification to the database
    const order=await Order.find({'paymentDetails.pidx':pidx})
    order[0].paymentDetails.method='Khalti'
    order[0].paymentDetails.status="Paid"
    await order[0].save()
    //clear the cart items !we dont need it after the payment
    const user=await User.findById(userId)
    user.cart=[]
    await user.save()
    return res.status(200).json({
      message:"Payment Verified Successfully"
    })
    //notofy to fronted
    // res.redirect("http://localhost:3000");
  } 
  // else {
  //   res.redirect("http://localhost:3000/errorPage");
  // }
};
