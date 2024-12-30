const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

app.set("view engine", "ejs");
app.use("views", express.static(path.join(__dirname, "/views")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.listen(PORT, (req, res) => {
    console.log(`Listening to port ${PORT}`);
});