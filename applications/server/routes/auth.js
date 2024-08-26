/** @format */

const express = require("express");
const router = express.Router();
const { executeQuery } = require("../utils/db");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM [dbo].[users] WHERE username = @username AND password = @password`;

  try {
    const result = await executeQuery(query, {
      username: { type: "NVarChar", value: username },
      password: { type: "NVarChar", value: password },
    });

    if (result.recordset.length > 0) {
      req.session.user = username;
      res.send("Login successful");
    } else {
      res.json({ success: true, message: "Login successful" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
