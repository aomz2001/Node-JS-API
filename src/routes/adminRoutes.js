module.exports = app => {
    const admin = require("../controllers/adminControllers");
  
    app.post("/district", admin.createDistrict);
    app.post("/pet", admin.createPet);
    app.post("/price", admin.createPrice);
    app.post("/service", admin.createService);

    app.get("/district", admin.showDistrict);
    app.get("/pet", admin.showPet);
    app.get("/price", admin.showPrice);
    app.get("/service", admin.showService);

    app.put("/district/:districtId", admin.updateDistrict);
    app.put("/pet/:petId", admin.updatePet);
    app.put("/price/:priceId", admin.updatePrice);
    app.put("/service/:serviceId", admin.updateService);

    app.delete("/district/:districtId", admin.deleteDistrict);
    app.delete("/pet/:petId", admin.deletePet);
    app.delete("/price/:priceId", admin.deletePrice);
    app.delete("/service/:serviceId", admin.deleteService);
  };