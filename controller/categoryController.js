import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      res.status(200).send({
        success: true,
        message: "Category already existing",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      err,
      message: "Error in category",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category update Successfully",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while updating category",
      err,
    });
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All categories List",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while retrieving categories",
      err,
    });
  }
};

export const getSingleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    res.status(200).send({
      success: true,
      messgae: "Single category retrieved successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while retrieving single category",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      messgae: "Single category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting single category",
      error,
    });
  }
};
