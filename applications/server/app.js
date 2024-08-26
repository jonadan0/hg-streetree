const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const cors = require('cors');

const farmRoutes = require("./routes/farm");
const authRoutes = require("./routes/auth");

const app = express();

// CORS 설정
app.use(cors());

// 세션 설정
app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),  // 랜덤 세션 비밀 키 생성
    resave: false,
    saveUninitialized: false,  // 비어있는 세션은 저장하지 않음
    cookie: {
      secure: process.env.NODE_ENV === "production",  // 프로덕션 환경일 때만 secure 쿠키 사용
      maxAge: 30 * 60 * 1000  // 세션 유효기간 30분 설정
    }
  })
);

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// JSON과 URL-encoded 데이터 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/farm", farmRoutes);
app.use("/auth", authRoutes);

// 서버 실행
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
