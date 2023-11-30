const Product = require("../../../model/productModel")
const Review = require("../../../model/reviewModel")
//create review!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.createReview=async(req,res)=>{
    const userId=req.user.id
    const {rating,message}=req.body
    const productId=req.params.id
    if(!rating||!message||!productId){
        return res.status(400).json({
            message:"Please provide rating,message,productId"
        })
    }
    //check if that productId product exists or not
    const productExist=await Product.findById(productId)
    if(!productExist){
        return res.status(404).json({
            message:"Product with that productId doesn't exist"
        })
    }
    await Review.create({
        userId:userId,
        productId:productId,
        rating:rating,
        message:message
    })
    res.status(200).json({
        message:"Review added successfully"
    })
}
//getReview!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.getProductReview=async(req,res)=>{
    const productId=req.params.id
    if(!productId){
        return res.status(400).json({
            message:"Please provide productId"
        })
    }
    const productExist=await Product.findById(productId)
    if(!productExist){
        return res.status(400).json({
            message:"Product with that id doesn't exist"
        })
    }
    const reviews=await Review.find({productId}).populate("userId").populate("productId")//also fatch the data of user using id
    res.status(200).json({
        message:"Review fatched successfully",
        data:reviews
    })
}
exports.getMyReview=async(req,res)=>{
    const userId=req.user.id
    const reviews=await Review.find({userId})
    if(reviews.length==0){
        res.status(404).json({
            message:"You haven't give reiew to any products yet",
            reviews:[]
        })
    }else{
        res.status(200).json({
            message:"My review fatched successfuly",
            data:reviews
        })
    }
}
// exports.chechParamsId=(req,id)=>{
//     res.status(400).json({
//         message:`Please provide id ${id}`
//     })
//}
exports.deleteReview=async(req,res)=>{
    const reviewId=req.params.id
    // this.chechParamsId(res,"ReviewId")
    const userId=req.params.id
    const review=Review.findById(reviewId)
    const ownerIdOfReview=review.userId
    if(ownerIdOfReview!==userId){
        return res.status(400).json({
            message:"You don't have permission to delete this review"
        })
    }
    if(!reviewId){
       return res.status(400).json({
            message:"Please provide reviewId"
        })
    }
    await Review.findByIdAndDelete(reviewId)
    res.status(200).json({
        message:"Review delete successfully "
    })
}

// exports.addProductReview=async(req,res)=>{
//     const productId=req.params.id
//     const {rating,message}=req.body
//     const userId=req.user.id
//     const review={
//         userId,
//         rating,
//         message
//     }
//     const product=await Product.findById(productId)
//     product.reviews.push(review)
//     await product.save()
//     res.json({
//         message:"Review done"
//     })
// }
