const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const farmRoutes = require("./routes/farm");
const authRoutes = require("./routes/auth");

const app = express();

// Session setup
app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/farm", farmRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 2626;
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});