const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const provider = require("../controllers/providerControllers");

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

    router.put("/api/job-complete-status",authMiddleware, provider.jobComplete);

module.exports = router;