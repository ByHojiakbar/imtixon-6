const Joi = require("joi");

// CATEGORY VALIDATOR
const categoryValidator = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name must not be empty",
    "string.min": "Category name must be at least 3 characters",
    "any.required": "Category name is required",
  }),

  category_image: Joi.string().trim().optional().messages({
    "string.base": "Category image must be a string",
  }),
});


// BOOK VALIDATOR
const bookValidator = Joi.object({

  book_name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Book name must be a string",
    "string.empty": "Book name must not be empty",
    "string.min": "Book name must be at least 2 characters",
    "any.required": "Book name is required",
  }),

  author: Joi.string().trim().min(3).required().messages({
    "string.base": "Author must be a string",
    "string.empty": "Author must not be empty",
    "any.required": "Author is required",
  }),

  publish_year: Joi.number().integer().min(1500).max(2100).required().messages({
    "number.base": "Publish year must be a number",
    "number.integer": "Publish year must be an integer",
    "any.required": "Publish year is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),

  description: Joi.string().trim().max(1000).allow("").messages({
    "string.base": "Description must be a string",
  }),

  pages: Joi.number().min(1).optional().messages({
    "number.base": "Pages must be a number",
  }),

  language: Joi.string().trim().optional().messages({
    "string.base": "Language must be a string",
  }),

  publisher: Joi.string().trim().optional().messages({
    "string.base": "Publisher must be a string",
  }),

  book_image: Joi.string().trim().optional().messages({
    "string.base": "Book image must be a string",
  }),

  categoryId: Joi.string().trim().required().messages({
    "any.required": "Category is required",
  }),
});

module.exports = {
  categoryValidator,
  bookValidator,
};

