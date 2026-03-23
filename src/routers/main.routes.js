const { Router } = require("express");

const categoryRouter = require("./category.routes");
const authRouter = require("./auth.routes");
const bookRouter = require("./book.routes");

const authGuard = require("../guards/auth.guard");

const mainRouter = Router();

// AUTH routes (ochiq)
mainRouter.use("/auth", authRouter);

// Boshqa hamma route lar uchun auth
mainRouter.use(authGuard);

// CATEGORY
mainRouter.use("/category", categoryRouter);

// BOOK
mainRouter.use("/book", bookRouter);

module.exports = mainRouter;
