const express = require("express");

const app = express();
const port = 8081;

// middleware
app.use(express.json());

// routes
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books"); // optional

app.get("/", (req, res) => {
    res.json({ message: "Home Page :-)" });
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});