const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { executeQuery } = require("../utils/db");

router.post("/regifarm", upload.single("image"), async (req, res) => {
  const { 
    farmAddress: address, 
    farmCrop: crop, 
    farmGiveMoney: giveMoney, 
    farmIntro: intro, 
    farmPhone: showPhone, 
    farmName: showName, 
    farmWork: work, 
    farmDay: day, 
    farmInfo: info, 
    farmMoney: money, 
    farmDate: date 
  } = req.body;
  
  const picture = req.file ? req.file.buffer : null;

  const insertQuery = `
    INSERT INTO [dbo].[farms] 
    (address, crop, giveMoney, intro, showPhone, showName, work, day, info, money, date, picture)
    VALUES 
    (@address, @crop, @giveMoney, @intro, @showPhone, @showName, @work, @day, @info, @money, @date, @picture)
  `;

  try {
    await executeQuery(insertQuery, {
      address: { type: "NVarChar", value: address },
      crop: { type: "NVarChar", value: crop },
      giveMoney: { type: "Bit", value: giveMoney },
      intro: { type: "NVarChar", value: intro },
      showPhone: { type: "Bit", value: showPhone },
      showName: { type: "Bit", value: showName },
      work: { type: "Bit", value: work },
      day: { type: "Int", value: day },
      info: { type: "NVarChar", value: info },
      money: { type: "Decimal", value: money },
      date: { type: "Date", value: date },
      picture: { type: "VarBinary", value: picture },
    });
    res.json({ success: true, message: "Regist successful" }); // JSON 형식으로 응답
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // JSON 형식으로 에러 메시지 반환
  }
});

module.exports = router;
