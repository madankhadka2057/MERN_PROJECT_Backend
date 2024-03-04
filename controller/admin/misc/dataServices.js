const Order = require("../../../model/orderSchema")
const Product = require("../../../model/productModel")
const User = require("../../../model/userModel")


class DataServices{
    async  getDatas(req,res){
        const orders=(await Order.find()).length
        const users=(await User.find()).length
        const products=(await Product.find()).length
        const allOrders = await Order.find().populate({
            path: "items.product",
            model: "Product",
          }).populate('user');
          
        res.status(200).json({
            data: {
                orders,
                users,
                products,
                allOrders
            }
        });
    }
}

const DataServiceObj=new DataServices ()

module.exports=DataServiceObj