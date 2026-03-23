
const { globalError, ClientError } = require("shokhijakhon-error-handler");
const path = require("path");

const Book = require("../models/book.model");
const Category = require("../models/category.model");

const { bookValidator } = require("../utils/validators/book.validator");

module.exports = {

  async CREATE_BOOK(req, res) {
    try {
      let newBook = req.body;

      await bookValidator.validateAsync(newBook);

      if (req.filename) {
        await req.files.book_image.mv(
          path.join(process.cwd(), "uploads", "book_images", req.filename)
        );
      }

      const category = await Category.findByPk(newBook.categoryId);

      if (!category) throw new ClientError("Category not found", 404);

      await Book.create({
        book_name: newBook.book_name,
        author: newBook.author,
        publish_year: newBook.publish_year,
        pages: newBook.pages,
        language: newBook.language,
        publisher: newBook.publisher,
        description: newBook.description,
        price: newBook.price,
        book_image: `/uploads/book_images/${req.filename}`,
        categoryId: newBook.categoryId
      });

      return res.json({
        message: "Book successfully created",
        status: 201
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async GET_BOOK(req, res) {
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id, {
        include: {
          model: Category,
          attributes: ["name", "category_image"]
        }
      });

      if (!book) throw new ClientError("Book not found", 404);

      return res.json(book);

    } catch (err) {
      return globalError(err, res);
    }
  },


  async GET_BOOKS(req, res) {
    try {

      const books = await Book.findAll({
        include: {
          model: Category,
          attributes: ["name", "category_image"]
        }
      });

      return res.json(books);

    } catch (err) {
      return globalError(err, res);
    }
  },


  async GET_BOOKS_BY_CATEGORY(req, res) {
    try {

      const { categoryId } = req.params;

      const books = await Book.findAll({
        where: { categoryId },
        include: {
          model: Category,
          attributes: ["name", "category_image"]
        },
        order: [["createdAt", "DESC"]]
      });

      return res.json(books);

    } catch (err) {
      return globalError(err, res);
    }
  },


  async UPDATE_BOOK(req, res) {
    try {

      const { id } = req.params;
      const data = req.body;

      const book = await Book.findByPk(id);

      if (!book) throw new ClientError("Book not found", 404);

      if (data.categoryId) {
        const category = await Category.findByPk(data.categoryId);
        if (!category) throw new ClientError("Category not found", 404);
      }

      await Book.update(
        {
          book_name: data.book_name || book.book_name,
          author: data.author || book.author,
          publish_year: data.publish_year || book.publish_year,
          price: data.price || book.price,
          pages: data.pages || book.pages,
          language: data.language || book.language,
          publisher: data.publisher || book.publisher,
          description: data.description || book.description,
          categoryId: data.categoryId || book.categoryId
        },
        {
          where: { id }
        }
      );

      return res.json({
        message: "Book updated successfully",
        status: 200
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async DELETE_BOOK(req, res) {
    try {

      const { id } = req.params;

      const book = await Book.findByPk(id);

      if (!book) throw new ClientError("Book not found", 404);

      await Book.destroy({
        where: { id }
      });

      return res.json({
        message: "Book deleted successfully",
        status: 200
      });

    } catch (err) {
      return globalError(err, res);
    }
  }

};
