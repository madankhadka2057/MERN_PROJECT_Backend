const Product = require("../../../model/productModel");
const fs = require("fs");
//createProduct Api!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.createProduct = async (req, res) => {
  try {
    console.log(process.env.BACKEND_URL)
    // console.log(req.file)
    const file = req.file;
    if (!file) {
      filePath =
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";
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
    Product.create({
      productName,
      productDescription,
      productPrice,
      productStockQty,
      productStatus,
      productImage: process.env.BACKEND_URL + filePath,
    });
    res.status(200).json({
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//deleteProduct API!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    req.status(400).json({
      message: "Please provide id",
    });
  }
  const oldData=await Product.findById(id)
  const oldImage=oldData.productImage
  // console.log(oldImage)
  const actualOldImagePath=oldImage.slice(22)
  // console.log(actualOldImagePath)
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
  console.log(file);
  console.log(req.body);
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