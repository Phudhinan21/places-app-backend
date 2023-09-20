const express = require("express");
const mongoose = require("mongoose");
const app = express();

const usersRoutes = require("./routes/api/users-routes");
const placeRoutes = require("./routes/api/places-routes");

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/places", placeRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not found");
  error.code = 404;
  return next(error);
});

app.use((error, req, res, next) => {
  const message = error.message || "Server error";
  const statusCode = error.code || 500;
  res.status(statusCode).json({ message: message });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.49kwkjl.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("mongoDB connecting...");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
