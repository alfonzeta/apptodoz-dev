const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const todos = require("./routes/todos");
const users = require("./routes/users");
const signup = require("./routes/signup");
const login = require("./routes/login");
const contactRequests = require("./routes/contactRequests");


// Antes de los endpoints, usamos los middlewares
app.use(cors());
app.use(express.json())
app.use("/todos", todos)
app.use("/users", users)
app.use("/signup", signup)
app.use("/login", login)
app.use("/contactRequests", contactRequests)


mongoose.connect(process.env.DB_URL)

const db = mongoose.connection;


db.on("error", (err) => console.log("Connection to DB failed: ", err));
db.once("open", () => console.log("Connected to DB successfully"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});