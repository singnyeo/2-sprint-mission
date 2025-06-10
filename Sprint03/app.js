var createError = require("http-errors");
var express = require("express");
var logger = require("./utils/logger");
var path = require("path");

const cors = require("cors");
const productRouter = require("../routes/products");
const articlesRouter = require("../routes/articles");
const productCommentRouter = require("../routes/comments/productComments");
const articleCommentRouter = require("../routes/comments/articleComments");
const filesRouter = require("../routes/files");
const errorHandler = require("./utils/errorHandler");

var app = express();

app.use(cors());
app.use(logger);
app.use(express.json());

app.use("/products",productRouter);
app.use("/articles",articlesRouter);
app.use("/products/:productId/comments", productCommentRouter);
app.use("/articles/:articleId/comments", articleCommentRouter);
app.use("/files", filesRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("서버 실행 완료");
});

app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

app.use(errorHandler);

module.exports = app;