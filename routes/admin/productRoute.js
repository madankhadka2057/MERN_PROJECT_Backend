const {
  createProduct,
  deleteProduct,
  editProduct,
  updateProductStatus,
  updateProductQtyAndPrice,
  getOrderOfProduct,
} = require("../../controller/admin/product/productController");
const { getProducts, getProduct } = require("../../controller/global/globalController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const { storage, multer } = require("../../middleware/multerConfig");
const restrictTo = require("../../middleware/restrictTo");
const catchAsync = require("../../services/catchAsync");
const router = require("express").Router();
const upload = multer({ storage: storage });

// router.route("/product",createProduct)
// router.route("/product",getProducts)

router
  .route("/")
  .post(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(createProduct)
  )
  .get(catchAsync(getProducts));
router
  .route("/:id")
  .get(catchAsync(getProduct))
  .delete(isAuthenticated,restrictTo("admin"),catchAsync(deleteProduct))
  .patch
    (isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(editProduct))
router.route("/updateproductstatus/:id").patch(isAuthenticated,restrictTo("admin"),catchAsync(updateProductStatus))
router.route("/updateqtyandprice/:id").patch(isAuthenticated,restrictTo("admin"),catchAsync(updateProductQtyAndPrice))
router.route("/orderOfProduct/:id").get(isAuthenticated,restrictTo("admin"),catchAsync(getOrderOfProduct))
// router.route("/delete/:id")

module.exports = router;
