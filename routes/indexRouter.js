const express = require("express");
const authRouter = require("./authRouter");
const classRouter = require("./classRouter");
const subjectRouter = require("./subjectRouter");
const chapterRouter = require("./chapterRouter");
const bookRouter = require("./bookRouter");
const blogRouter = require("./blogRouter");
const quoteRouter = require("./quoteRouter");
const contactRouter = require("./contactRouter");
const serviceRouter = require("./serviceRouter");

const indexRouter = express.Router();

indexRouter.use("/auth/user", authRouter);
indexRouter.use("/class", classRouter);
indexRouter.use("/subject", subjectRouter);
indexRouter.use("/chapter", chapterRouter);
indexRouter.use("/book", bookRouter);
indexRouter.use("/blog", blogRouter);
indexRouter.use("/quote", quoteRouter);
indexRouter.use("/contact", contactRouter);
indexRouter.use("/service", serviceRouter);

module.exports = indexRouter;
