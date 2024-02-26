const Order = require("../../../model/orderSchema");
const Product = require("../../../model/productModel");
const fs = require("fs");
//createProduct Api!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.createProduct = async (req, res) => {
  try {
    // console.log(process.env.BACKEND_URL)
    // console.log(req.file)
    const file = req.file;
    if (!file) {
      filePath ="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";
    } else {
      filePath = req.file.filename;
    }
    const {
      productName,
      productDescription,
      productPrice,
      productStatus,
      productStockQty,
    } = req.body;
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productStatus ||
      !productStockQty
    ) {
      return res.status(400).json({
        message: "Please Provide all the field",
      });
    }
    //insert into the Product collection/table
    const data=await Product.create({
      productName,
      productDescription,
      productPrice,
      productStockQty,
      productStatus,
      productImage: process.env.BACKEND_URL + filePath,
    });
    res.status(200).json({
      message: "Product created successfully",
      data:data
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
//deleteProduct API!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
   return req.status(400).json({
      message: "Please provide id",
    });
  }
  const oldData=await Product.findById(id)
  const oldImage=oldData.productImage
  const actualOldImagePath=oldImage.slice(22)
  await Product.findByIdAndDelete(id);
  fs.unlink(`./uploads/${actualOldImagePath}`,(err)=>{
    if(err){
        console.log("Error to delete image",err)
    }else{
        console.log("Image successfully deleted")
    }
  })
  res.status(200).json({
    message: "Successfully deleted",
  });
};
//editProduct Api!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  if (!id) {
    return res.status(400).json({
      message: "Please Provide id",
    });
  }
  const {
    productName,
    productDescription,
    productPrice,
    productStatus,
    productStockQty,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productStatus ||
    !productStockQty
  ) {
    return res.status(400).json({
      message: "Please Provide all the field",
    });
  }
  const oldData = await Product.findById(id);
  console.log(oldData);
  if (!oldData) {
    return res.status(404).json({
      message: "No data found with id",
    });
  }
  const oldProductImage = oldData.productImage;
  const cutOldProductImage = oldProductImage.slice(22);
  if (req.file && req.file.filename) {
    fs.unlink(`./uploads/${cutOldProductImage}`, (err) => {
      if (err) {
        console.log("Error accure", err);
      } else console.log("File is deleted successfully");
    });
  }
  const datas = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productPrice,
      productStockQty,
      productStatus,
      productImage:
        req.file && req.file.filename
          ? process.env.BACKEND_URL + req.file.filename
          : oldProductImage,
    },
    {
      new: true, //hamle jun data update gareko xau tyo nai data paunako lagi
      runValidators: true,
    }
  );
  res.status(200).json({
    message: "Successfully updated",
    data:datas,
  });
};

//update produte Status,
exports.updateProductStatus=async(req,res)=>{
  const id=req.params.id
  // console.log(id)
  const {productStatus}=req.body
  // console.log(productStatus)
  if(!id){
    return res.status(400).json({
      message:"Please Provide Id"
    })
  }
  if(!productStatus||!["available","unavailable"].includes(productStatus.toLowerCase())){
   return res.status(400).json({
      message:"Invalide prouductStatus"
    })
  }
  const checkExist=await Product.findById(id)
  // console.log(checkExist)
  if(!checkExist===0){
   return res.status(404).json({
      message:"No data found with this id"
    })
  }
  const updatedData=await Product.findByIdAndUpdate(id,{
    productStatus
  },{new:true})
  res.status(200).json({
    newData:updatedData
  })
}

//update productQty and product price
exports.updateProductQtyAndPrice=async(req,res)=>{
  const {id}=req.params
  const {productStockQty,productPrice}=req.body
  if(!productStockQty &&!productPrice){
    return res.status(400).json({
      message:"Please provide productQty and productPrice"
    })
  }
  const product=await Product.findById(id)
  if(!product){
    return res.status(404).json({
      message:"No data found with this Id"
    })
  }
  const data=await Product.findByIdAndUpdate(id,{
    productStockQty:productStockQty?productStockQty:product.productStockQty,
    productPrice:productPrice?productPrice:product.productPrice
  },{new:true})
  res.status(200).json({
    message:"productStockQty and productPrice updated Sucessfully",
    data:data
  })
}
exports.getOrderOfProduct=async(req,res)=>{
  const {id:productId}=req.params
  const checkProduct= await Product.findById(productId)
  if(!checkProduct){
    return res.status(400).json({
      message:"No product found"
    })
  }
  // console.log("Hello")
  // const productId = id
  const data= await Order.find({'items.product':productId}).populate('user')
  res.status(200).json({
    message:"ProductOrder fatched successfully ",
    data:data
  })

}