const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { executeQuery } = require("../utils/db");

router.post("/regifarm", async (req, res) => {
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

  const moneyParsed = parseFloat(money);

  if (isNaN(moneyParsed)) {
    return res.status(400).json({ success: false, message: "Invalid money value" });
  }

  const insertQuery = `
    INSERT INTO [dbo].[farms] 
    (address, crop, giveMoney, intro, showPhone, showName, work, day, info, money, date)
    VALUES 
    (@address, @crop, @giveMoney, @intro, @showPhone, @showName, @work, @day, @info, @money, @date)
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
    });
    res.json({ success: true, message: "Regist successful" }); // JSON 형식으로 응답
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // JSON 형식으로 에러 메시지 반환
  }
});

router.post("/getfarms", async (req, res) => {
  const { startId, endId } = req.body;

  const selectQuery = `
    SELECT * 
    FROM [dbo].[farms]
    WHERE id BETWEEN @startId AND @endId
  `;

  try {
    // 데이터베이스에서 농장 정보를 가져옴
    let farms = await executeQuery(selectQuery, {
      startId: { type: "Int", value: startId },
      endId: { type: "Int", value: endId }
    });

    console.log('Queried farms:', farms);

    // 쿼리 결과를 배열로 묶어 JSON으로 응답
    res.json({ success: true, data: farms });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;