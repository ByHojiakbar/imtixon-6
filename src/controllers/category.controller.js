
const { globalError, ClientError } = require("shokhijakhon-error-handler");
const path = require("path");

const Category = require("../models/category.model");
const Book = require("../models/book.model");

const { categoryValidator } = require("../utils/validators/category.validator");

module.exports = {

  async CREATE_CATEGORY(req, res) {
    try {
      const newCategory = req.body;

      await categoryValidator.validateAsync(newCategory);

      if (req.filename) {
        await req.files.category_image.mv(
          path.join(process.cwd(), "uploads", "category_images", req.filename)
        );
      }

      await Category.create({
        ...newCategory,
        category_image: req.filename
      });

      return res.json({
        message: "Category successfully created",
        status: 201
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async GET_CATEGORY(req, res) {
    try {

      let { id } = req.params;

      if (id) {

        let findCategory = await Category.findByPk(id);

        if (!findCategory)
          throw new ClientError("Category not found", 404);

        return res.json(findCategory);
      }

      let categories = await Category.findAll();

      return res.json(categories);

    } catch (err) {
      return globalError(err, res);
    }
  },


  async UPDATE_CATEGORY(req, res) {
    try {

      const { id } = req.params;
      const data = req.body;

      const category = await Category.findByPk(id);

      if (!category)
        throw new ClientError("Category not found", 404);

      const name = String(data.name).trim();

      const exists = await Category.findOne({
        where: { name }
      });

      if (exists && exists.id !== id)
        throw new ClientError("Category already exists", 400);

      await Category.update(
        { name },
        { where: { id } }
      );

      return res.json({
        message: "Category updated successfully",
        status: 200
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async DELETE_CATEGORY(req, res) {
    try {

      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category)
        throw new ClientError("Category not found", 404);

      await Book.destroy({
        where: { categoryId: id }
      });

      await Category.destroy({
        where: { id }
      });

      return res.json({
        message: "Category and related books deleted",
        status: 200
      });

    } catch (err) {
      return globalError(err, res);
    }
  }

};

