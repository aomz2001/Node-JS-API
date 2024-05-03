const express = require('express');
const router = express.Router();
const users = require("../../controllers/usersControllers");
const provider = require("../../controllers/providerControllers");
const admin = require("../../controllers/adminControllers");

  router.post("/signup", users.create);
  router.post("/login", users.login);
  router.post("/api/search-provider", users.findProvider);
  router.post("/api/provider-search", users.providerSearch);
  router.post("/api/provider-data", users.providerProfile);
  router.get("/api/get-review", users.showUserReview);
  router.get("/api/get-avg-ratings", users.avgRatings);
  router.get("/api/read-users-profile", users.readProfile);
  router.get("/api/get-users-profile", users.getProfile);
  
  router.post("/signup-provider", provider.create);
  router.post("/login-provider", provider.login);
  router.get("/api/show-payment-state", provider.readFile);
  router.get("/api/get-payment-file", provider.getPaymentFile);
  router.get("/api/read-provider-profile", provider.readProfile);
  router.get("/api/get-provider-profile", provider.getProfile);

  router.get("/district", admin.showDistrict);
  router.get("/pet", admin.showPet);
  router.get("/price", admin.showPrice);
  router.get("/service", admin.showService);

module.exports = router;