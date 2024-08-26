const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { executeQuery } = require("../utils/db");

router.post("/regifarm", upload.single("image"), async (req, res) => {
  const { address, type, request, introduction, description } = req.body;
  const image = req.file ? req.file.buffer : null;

  const insertQuery = `
    INSERT INTO [dbo].[farm] (address, type, request, introduction, description, image)
    VALUES (@address, @type, @request, @introduction, @description, @image)
  `;

  try {
    await executeQuery(insertQuery, {
      address: { type: "NVarChar", value: address },
      type: { type: "NVarChar", value: type },
      request: { type: "NVarChar", value: request },
      introduction: { type: "NVarChar", value: introduction },
      description: { type: "NVarChar", value: description },
      image: { type: "VarBinary", value: image },
    });
    res.send("Farm registered successfully");
  } catch (err) {
    res.status(500).send("Failed to register farm: " + err.message);
  }
});

module.exports = router;