module.exports = (app) => {
    const provider = require("../controllers/providerControllers");
    const multer = require("multer");
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./tmp");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.originalname.split(".")[0] +
        "-" +
        uniqueSuffix +
        "." +
        file.mimetype.split("/")[1]
        req.query.filename = filename
        cb(
          null,
          filename
        );
      },
    });
    const upload = multer({ storage: storage });
    app.post("/signup-provider", provider.create);
  
    app.post("/login-provider", provider.login);
  
    app.get("/provider-data", provider.showProviderData);
  
    app.put("/provider-data/:updateId", provider.updateProviderData);
  
    app.delete("/provider-data/:deleteId", provider.deleteProviderData);
  
    app.get("/provider-data-district/:providerId", provider.showProviderDistrict);
  
    app.put("/provider-data-district/:providerId", provider.putProviderDistrict);
  
    app.get("/provider-data-pet/:providerId", provider.showProviderPet);
  
    app.put("/provider-data-pet/:providerId", provider.putProviderPet);
  
    app.get("/provider-data-service/:providerId", provider.showProviderService);
  
    app.put("/provider-data-service/:providerId", provider.putProviderService);
  
    app.get("/api/provider-all-service", provider.providerAllService);
  
    app.post("/api/provider-search", provider.providerSearch);
  
    app.post("/api/provider-data", provider.providerProfile);
  
    app.post("/api/req-service", provider.reqProviderService);
  
    app.get("/api/show-req-service", provider.showReqService);
  
    app.delete("/api/delete-req-service", provider.deleteReqService);
  
    app.post("/api/accept-service", provider.acceptJobUsers);
  
    app.get("/api/show-accept-service", provider.showAcceptService);
  
    app.delete("/api/delete-accept-service", provider.deleteAcceptService);
  
    app.post("/api/generate-qr", provider.generateQRCode);
  
    app.put(
      "/api/upload-payment",
      upload.single("file"),
      provider.uploadPayment
    );

    app.get("/api/show-payment-state", provider.readFile);

    app.get("/api/get-payment-file", provider.getPaymentFile);

    app.put("/api/update-status-work", provider.putStatusWork);

    app.put("/api/job-complete-status", provider.jobComplete);

    app.put("/api/put-status-payment", provider.putStatusPayment);

    app.post("/api/review-job", provider.reviewProviderJob);

    app.put("/api/report-provider", provider.putReportMessage);

    app.get("/api/get-review", provider.showUserReview)
  };