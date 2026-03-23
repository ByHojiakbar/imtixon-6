
const { Router } = require("express");

const authGuard = require("../guards/auth.guard");
const bookPhotoGuard = require("../guards/book-photo.guard");
const bookController = require("../controllers/book.controller");

const bookRouter = Router();

// CREATE BOOK
bookRouter.post(
  "/create",
  authGuard,
  bookPhotoGuard,
  bookController.CREATE_BOOK
);

// GET ALL BOOKS
bookRouter.get("/all", authGuard, bookController.GET_BOOKS);

// GET BOOKS BY CATEGORY
bookRouter.get(
  "/category/:categoryId",
  authGuard,
  bookController.GET_BOOKS_BY_CATEGORY
);

// GET SINGLE BOOK
bookRouter.get("/:id", authGuard, bookController.GET_BOOK);

// UPDATE BOOK
bookRouter.put("/:id", authGuard, bookController.UPDATE_BOOK);

// DELETE BOOK
bookRouter.delete("/:id", authGuard, bookController.DELETE_BOOK);

module.exports = bookRouter;

