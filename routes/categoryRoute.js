import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  getSingleCategoryController,
  updateCategoryController,
} from "../controller/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes
//create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);
//getall categories
router.get("/get-categories", getCategoryController);

//get single category
router.get("/single-category/:slug", getSingleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);
export default router;
