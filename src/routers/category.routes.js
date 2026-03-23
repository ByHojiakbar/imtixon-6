const { Router } = require("express");

const categoryController = require("../controllers/category.controller");

const adminGuard = require("../guards/admin.guard");
const authGuard = require("../guards/auth.guard");
const categoryPhotoGuard = require("../guards/category-photo.guard");

const categoryRouter = Router();

// CREATE CATEGORY
categoryRouter.post(
  "/create",
  authGuard,
  adminGuard,
  categoryPhotoGuard,
  categoryController.CREATE_CATEGORY
);

// GET ALL CATEGORIES
categoryRouter.get("/all", categoryController.GET_CATEGORY);

// GET SINGLE CATEGORY
categoryRouter.get("/:id", categoryController.GET_CATEGORY);

// UPDATE CATEGORY
categoryRouter.put(
  "/update/:id",
  authGuard,
  adminGuard,
  categoryController.UPDATE_CATEGORY
);

// DELETE CATEGORY
categoryRouter.delete(
  "/delete/:id",
  authGuard,
  adminGuard,
  categoryController.DELETE_CATEGORY
);

module.exports = categoryRouter;

