
const express = require("express");
const sql = require("mssql");
const session = require("express-session");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();

const dbconfig = require("./devconfig/dbconfig.json");
const config = {
  user: dbconfig.user,
  password: dbconfig.password,
  server: dbconfig.server,
  database: dbconfig.database,
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};

// 세션 설정
app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS 통신할 경우 true로 바꿔주세요.
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SQL 쿼리 실행 함수
const executeQuery = async (query, params) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.NVarChar, params.username)
      .input("password", sql.NVarChar, params.password)
      .input("realname", sql.NVarChar, params.realname)
      .input("work", sql.Bit, params.work)
      .query(query);
    return result;
  } catch (err) {
    console.error("Database query failed:", err);
    throw new Error("Database query failed");
  }
};

// 아이디 존재 여부 확인
app.get("/check-id/:id", async (req, res) => {
  const query = `SELECT COUNT(*) AS count FROM [dbo].[users] WHERE username = @username`;
  try {
    const result = await executeQuery(query, { username: req.params.id });
    res.send(result.recordset[0].count.toString());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 로그인 처리
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM [dbo].[users] WHERE username = @username AND password = @password`;
  try {
    const result = await executeQuery(query, { username, password });
    if (result.recordset.length > 0) {
      req.session.user = username;
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/register", async (req, res) => {
  const { username, password, realname, work } = req.body;
  const checkQuery = `SELECT COUNT(*) AS count FROM [dbo].[users] WHERE username = @username`;
  const insertQuery = `INSERT INTO [dbo].[users] (username, password, realname, work) VALUES (@username, @password, @realname, @work)`;

  try {
    const checkResult = await executeQuery(checkQuery, { username });
    if (checkResult.recordset[0].count > 0) {
      res.status(409).send("Username already exists");
    } else {
      await executeQuery(insertQuery, { username, password, realname, work });
      res.send("Registration successful");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.send("Logout successful");
  });
});

const port = 2626;
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
