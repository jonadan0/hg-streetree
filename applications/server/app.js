const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require('cors');

const farmRoutes = require("./routes/farm");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());

// Session setup
app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/farm", farmRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 6974;
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});