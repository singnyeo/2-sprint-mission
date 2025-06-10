var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var path = require("path");
const { db } = require("../utils/db");

// uploads/files 폴더에 저장되도록 설정
const uploadDir = path.join(__dirname, "../uploads/files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// 파일 리스트 조회
router.get("/", async (req, res) => {
  const files = await db.file.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ requestTime: req.requestTime, files });
});

// 파일 업로드
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { originalname, filename } = req.file;
  const extension = path.extname(originalname);
  const newFileName = filename + extension;
  const newFilePath = path.join(uploadDir, newFileName);
  fs.renameSync(req.file.path, newFilePath);

  const file = await db.file.create({
    data: {
      fileName: originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/files/uploads/files/${newFileName}`,
    },
  });

  res.json({ message: "OK", file });
});
module.exports = router;
