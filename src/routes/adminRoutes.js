const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
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
   
const router = express.Router();

    const admin = require("../controllers/adminControllers");

    router.post("/district",authMiddleware, admin.createDistrict);
    router.post("/pet",authMiddleware, admin.createPet);
    router.post("/price",authMiddleware, admin.createPrice);
    router.post("/service",authMiddleware, admin.createService);

    router.put("/district/:districtId",authMiddleware, admin.updateDistrict);
    router.put("/pet/:petId",authMiddleware, admin.updatePet);
    router.put("/price/:priceId",authMiddleware, admin.updatePrice);
    router.put("/service/:serviceId",authMiddleware, admin.updateService);

    router.delete("/district/:districtId",authMiddleware, admin.deleteDistrict);
    router.delete("/pet/:petId",authMiddleware, admin.deletePet);
    router.delete("/price/:priceId",authMiddleware, admin.deletePrice);
    router.delete("/service/:serviceId",authMiddleware, admin.deleteService);
    router.delete("/api/clear-work-list",authMiddleware, admin.clearWorklist);

    router.put("/api/put-status-payment",authMiddleware, admin.putStatusPayment);
    router.put("/api/update-status-work",authMiddleware, admin.putStatusWork);

    router.post("/api/generate-qr-admin", authMiddleware, admin.generateQRCodeAdmin);

    router.put(
        "/api/upload-payment-admin",
        authMiddleware,
        upload.single("file"),
        admin.uploadPayment
      );

module.exports = router;