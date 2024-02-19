const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const users = require("../controllers/usersControllers");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.originalname.split(".")[0] +
      "-" +
      uniqueSuffix +
      "." +
      file.mimetype.split("/")[1];
    req.query.filename = filename;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

router.get("/users-data", authMiddleware, users.showUserData);

router.put("/users-data/:updateId", authMiddleware, users.updateUserData);

router.delete("/users-data/:deleteId", authMiddleware, users.deleteUserData);

router.post("/api/req-service", authMiddleware, users.reqProviderService);

router.get("/api/show-accept-service", authMiddleware, users.showAcceptService);

router.delete(
  "/api/delete-accept-service",
  authMiddleware,
  users.deleteAcceptService
);

router.put("/api/report-provider", authMiddleware, users.putReportMessage);

router.delete(
  "/api/understand-job-cancel",
  authMiddleware,
  users.understandJobCancel
);

router.put("/api/users-cancel-job", authMiddleware, users.usersCancelJob);

router.post("/api/generate-qr", authMiddleware, users.generateQRCode);

router.put(
  "/api/upload-payment",
  authMiddleware,
  upload.single("file"),
  users.uploadPayment
);

router.post("/api/review-job",authMiddleware, users.reviewProviderJob);

module.exports = router;
