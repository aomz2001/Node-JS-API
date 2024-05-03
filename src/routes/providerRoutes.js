const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();
const provider = require("../controllers/providerControllers");

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

    router.get("/provider-data",authMiddleware, provider.showProviderData);
  
    router.put("/provider-data/:updateId",authMiddleware, provider.updateProviderData);
  
    router.delete("/provider-data/:deleteId",authMiddleware, provider.deleteProviderData);
  
    router.get("/provider-data-district/:providerId",authMiddleware, provider.showProviderDistrict);
  
    router.put("/provider-data-district/:providerId",authMiddleware, provider.putProviderDistrict);
  
    router.get("/provider-data-pet/:providerId",authMiddleware, provider.showProviderPet);
  
    router.put("/provider-data-pet/:providerId",authMiddleware, provider.putProviderPet);
  
    router.get("/provider-data-service/:providerId",authMiddleware, provider.showProviderService);
  
    router.put("/provider-data-service/:providerId",authMiddleware, provider.putProviderService);
  
    router.get("/api/provider-all-service",authMiddleware, provider.providerAllService);
  
    router.get("/api/show-req-service",authMiddleware, provider.showReqService);
  
    router.delete("/api/delete-req-service",authMiddleware, provider.deleteReqService);
  
    router.post("/api/accept-service",authMiddleware, provider.acceptJobUsers);

    router.put("/api/cancel-job-status",authMiddleware, provider.updateJobstatus);

    router.put("/api/job-complete-status",authMiddleware, provider.jobComplete);

    router.put(
        "/api/upload-provider-profile",
        authMiddleware,
        upload.single("file"),
        provider.UploadProfile
      );

module.exports = router;