var createError = require("http-errors");
var express = require("express");
var logger = require("./utils/logger");
var path = require("path");

const cors = require("cors");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productCommentRouter = require("./routes/comments/productComments");
const articleCommentRouter = require("./routes/comments/articleComments");
const filesRouter = require("./routes/files");
const errorHandler = require("./utils/errorHandler");

var app = express();

app.use(cors());
app.use(logger);
app.use(express.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products/:productId/comments", productCommentRouter);
app.use("/articles/:articleId/comments", articleCommentRouter);
app.use("/files", filesRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

app.use(errorHandler);

module.exports = app;