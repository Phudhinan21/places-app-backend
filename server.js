const express = require("express");
const mongoose = require("mongoose");
const app = express();

const usersRoutes = require("./routes/api/users-routes");

app.use(express.json());

app.use("/api/users", usersRoutes);

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
