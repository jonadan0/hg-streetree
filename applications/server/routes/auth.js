const express = require("express");
const router = express.Router();
const { executeQuery } = require("../utils/db");

// 로그인
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM [dbo].[users] WHERE username = @username AND password = @password`;

  try {
    const result = await executeQuery(query, {
      username: { type: "NVarChar", value: username },
      password: { type: "NVarChar", value: password },
    });

    if (result.recordset.length > 0) {
      // 세션 설정
      req.session.user = { username };
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ success: false, message: "Failed to logout" });
      }
      res.clearCookie("connect.sid"); // 세션 쿠키 삭제
      res.json({ success: true, message: "Logout successful" });
    });
  } else {
    res.status(400).json({ success: false, message: "Not logged in" });
  }
});

router.post("/register", async (req, res) => {
  const { username, realname, password, work, phone, temperature } = req.body;

  // 입력값 검증
  if (!username || !realname || !password || !work || !phone || !temperature) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // 중복 사용자 확인
    const checkUserQuery = `
      SELECT * FROM [dbo].[users] WHERE username = @username
    `;
    const existingUser = await executeQuery(checkUserQuery, {
      username: { type: "NVarChar", value: username },
    });

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ success: false, message: "Username already exists" });
    }

    // 사용자 추가 쿼리 (평문 비밀번호 저장)
    const query = `
      INSERT INTO [dbo].[users] (username, realname, password, work, phone, temperature)
      VALUES (@username, @realname, @password, @work, @phone, @temperature)
    `;

    // 쿼리 실행
    await executeQuery(query, {
      username: { type: "NVarChar", value: username },
      realname: { type: "NVarChar", value: realname },
      password: { type: "NVarChar", value: password }, // 평문 비밀번호 저장
      work: { type: "NVarChar", value: work },
      phone: { type: "NVarChar", value: phone },
      temperature: { type: "Float", value: temperature },
    });

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
