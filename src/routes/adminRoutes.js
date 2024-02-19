const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
   
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

    router.put("/api/put-status-payment",authMiddleware, admin.putStatusPayment);
    router.put("/api/update-status-work",authMiddleware, admin.putStatusWork);

module.exports = router;