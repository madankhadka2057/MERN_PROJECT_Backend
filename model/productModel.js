const mongoose=require("mongoose")
const { reviewSchema } = require("./nextWayModel")
const Schema=mongoose.Schema

const ProductSchema=new Schema({
    productName:{
        type:String,
        required:[true,"Product Name is required"]
    },
    productDescription:{
        type:String,
        required:[true,"productDescription Name is required"]
    },
    productPrice:{
        type:String,
        required:[true,"productPrice Name is required"]
    },
    productStockQty:{
        type:String,
        required:[true,"productQuality Name is required"]
    },
    productStatus:{
        type:String,
        enum:["available","unavailable"]
    },
    productImage:String,
    // reviews:[reviewSchema]
},{
    timestamps:true
})
const Product=mongoose.model("Product",ProductSchema)
module.exports=Product