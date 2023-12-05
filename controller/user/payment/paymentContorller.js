const axios = require("axios");
const Order = require("../../../model/orderSchema");
exports.initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Please provide orderId and Amount",
    });
  }
  const data = {
    return_url: "http://localhost:3000/api/payment/success",
    website_url: "http://localhost:3000",
    amount: amount,
    purchase_order_id: orderId,
    purchase_order_name: "Madan Khadka" + orderId,
  };
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    data,
    {
      headers: {
        Authorization: "key 5bcedd19fdb4440e9f5b193ef0e2cc36",
      },
    }
  );
  console.log(response)
  const order=await Order.findById(orderId)
  order.paymentDetails.pidx=response.data.pidx
  await order.save()
  res.redirect(response.data.payment_url);
};

exports.verifyPidx = async (req, res) => {
  const pidx = req.query.pidx;
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx: pidx },
    {
      headers: {
        Authorization: "key 5bcedd19fdb4440e9f5b193ef0e2cc36",
      },
    }
  );
  if (response.data.status == "Completed") {
    //modification to the database
    const order=await Order.find({'paymentDetails.pidx':pidx})
    order[0].paymentDetails.method='Khalti'
    order[0].paymentDetails.status="Paid"
    await order[0].save()
    //notofy to fronted
    res.redirect("http://localhost:3000");
  } else {
    res.redirect("http://localhost:3000/errorPage");
  }
};
