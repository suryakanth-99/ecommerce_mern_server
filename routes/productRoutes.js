import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  getProductController,
  getSingleProductController,
  getproductPhotoController,
  prductDeleteController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  relatedProductsController,
  searchProductController,
  updateProductController,
} from "../controller/productController.js";
import formidable from "express-formidable";
const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//get products
router.get("/get-product", getProductController);

//get single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", getproductPhotoController);

//delete product
router.delete("/delete-product/:pid", prductDeleteController);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//filter product
router.post("/product-filters", productFilterController);

//count
router.get("/product-count", productCountController);

//product list per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//related Products
router.get("/related-products/:pid/:cid", relatedProductsController);

//category wise products
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);
export default router;
