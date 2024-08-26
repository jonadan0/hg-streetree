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
      res.json({ success: true, message: "Login successful" }); // JSON 형식으로 응답
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" }); // JSON 형식으로 응답
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // JSON 형식으로 에러 메시지 반환
  }
})

module.exports = router;
