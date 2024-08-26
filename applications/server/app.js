const express = require("express");
const sql = require("mssql");
const session = require("express-session");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
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

app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, //
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const executeQuery = async (query, params) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    
    for (const param in params) {
      if (params[param].type && params[param].value !== undefined) {
        request.input(param, params[param].type, params[param].value);
      }
    }
    
    const result = await request.query(query);
    return result;
  } catch (err) {
    console.error("Database query failed:", err);
    throw new Error("Database query failed");
  }
};

app.post("/regifarm", upload.single("image"), async (req, res) => {
  const { address, type, request, introduction, description } = req.body;
  const image = req.file ? req.file.buffer : null; // 파일 버퍼를 사용해 이미지 저장

  const insertQuery = `
    INSERT INTO [dbo].[farm] (address, type, request, introduction, description, image)
    VALUES (@address, @type, @request, @introduction, @description, @image)
  `;

  try {
    await executeQuery(insertQuery, {
      address: { type: sql.NVarChar, value: address },
      type: { type: sql.NVarChar, value: type },
      request: { type: sql.NVarChar, value: request },
      introduction: { type: sql.NVarChar, value: introduction },
      description: { type: sql.NVarChar, value: description },
      image: { type: sql.VarBinary, value: image }
    });
    
    res.send("Farm registered successfully");
  } catch (err) {
    res.status(500).send("Failed to register farm: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM [dbo].[users] WHERE username = @username AND password = @password`;
  try {
    const result = await executeQuery(query, { 
      username: { type: sql.NVarChar, value: username },
      password: { type: sql.NVarChar, value: password }
    });
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

const port = process.env.PORT | 2626;
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
