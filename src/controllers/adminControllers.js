const District = require("../models/admin/districtModels");
const Pet = require("../models/admin/petModels");
const Price = require("../models/admin/priceModels");
const Service = require("../models/admin/serviceModels");
const Admin = require("../models/admin/adminModels");
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const fs = require('fs/promises');
const path = require('path');

exports.createDistrict = (req, res) => {
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    const admin_service_district = new District({
        district_name: req.body.district_name,
    });
    District.create(admin_service_district, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating."
        });
        else res.send(data);
    });
};

exports.showDistrict = (req, res) => {
    District.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving."
          });
        else res.send(data);
    });
};

exports.updateDistrict = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    District.updateById(
        req.params.districtId,
        new District(req.body),
        (err, data) => {
            if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found District with id ${req.params.districtId}.`
                });
            } else {
                res.status(500).send({
                message: "Error updating District with id " + req.params.districtId
                });
            }
            } else res.send(data);
        }
    );
};

exports.deleteDistrict = (req, res) => {
    District.removeId(req.params.districtId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found District with id ${req.params.districtId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete District with id " + req.params.districtId
            });
          }
        } else res.send({ message: `District was deleted successfully!` });
    });
};

//========================================================================================

exports.createPet = (req, res) => {
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    const admin_service_pet = new Pet({
        pet_name: req.body.pet_name,
    });
    Pet.create(admin_service_pet, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating."
        });
        else res.send(data);
    });
};

exports.showPet = (req, res) => {
    Pet.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving."
          });
        else res.send(data);
    });
};
exports.updatePet = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    Pet.updateById(
        req.params.petId,
        new Pet(req.body),
        (err, data) => {
            if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found Pet with id ${req.params.petId}.`
                });
            } else {
                res.status(500).send({
                message: "Error updating Pet with id " + req.params.petId
                });
            }
            } else res.send(data);
        }
    );
};

exports.deletePet = (req, res) => {
    Pet.removeId(req.params.petId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Pet with id ${req.params.petId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Pet with id " + req.params.petId
            });
          }
        } else res.send({ message: `Pet was deleted successfully!` });
    });
};
//========================================================================================

exports.createPrice = (req, res) => {
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    const admin_service_price = new Price({
        price_name: req.body.price_name,
    });
    Price.create(admin_service_price, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating."
        });
        else res.send(data);
    });
};

exports.showPrice = (req, res) => {
    Price.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving."
          });
        else res.send(data);
    });
};

exports.updatePrice = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    Price.updateById(
        req.params.priceId,
        new Price(req.body),
        (err, data) => {
            if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found Price with id ${req.params.priceId}.`
                });
            } else {
                res.status(500).send({
                message: "Error updating Price with id " + req.params.priceId
                });
            }
            } else res.send(data);
        }
    );
};

exports.deletePrice = (req, res) => {
    Price.removeId(req.params.priceId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Price with id ${req.params.priceId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Price with id " + req.params.priceId
            });
          }
        } else res.send({ message: `Price was deleted successfully!` });
    });
};

//========================================================================================

exports.createService = (req, res) => {
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    const admin_service_service = new Service({
        service_name: req.body.service_name,
    });
    Service.create(admin_service_service, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating."
        });
        else res.send(data);
    });
};

exports.showService = (req, res) => {
    Service.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving."
          });
        else res.send(data);
    });
};

exports.updateService = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    Service.updateById(
        req.params.serviceId,
        new Service(req.body),
        (err, data) => {
            if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found Service with id ${req.params.serviceId}.`
                });
            } else {
                res.status(500).send({
                message: "Error updating Service with id " + req.params.serviceId
                });
            }
            } else res.send(data);
        }
    );
};

exports.deleteService = (req, res) => {
    Service.removeId(req.params.serviceId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Service with id ${req.params.serviceId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Service with id " + req.params.serviceId
            });
          }
        } else res.send({ message: `Service was deleted successfully!` });
    });
};

//========================================================================================

exports.putStatusWork = async (req, res) => {
  try {
    const { status_work, providerId, districtId, petId, serviceId,service_price, usersId } = req.body;
    const result = await Admin.updateReq(status_work, providerId, districtId, petId, serviceId,service_price, usersId);
    if (result) {
      res.status(200).json({ message: 'Status updated successfully' });
    } else {
      res.status(404).json({ message: 'No matching record found for update' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.putStatusPayment = async (req, res) => {
  try {
    const { payment_status, providerId, districtId, petId, serviceId,service_price, usersId } = req.body;
    const result = await Admin.paymentStatus(payment_status, providerId, districtId, petId, serviceId,service_price, usersId);
    if (result) {
      res.status(200).json({ message: 'Status updated successfully' });
    } else {
      res.status(404).json({ message: 'No matching record found for update' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.clearWorklist = async (req, res) => {
  try {
    const { usersId, districtId, serviceId, petId, service_price } = req.body; 
    await Admin.clearWorklist(usersId, districtId, serviceId, petId, service_price);

    res.status(200).send("Request service deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.generateQRCodeAdmin = async (req, res) => {
  try {
    const { mobileNumber, amount } = req.body;
    // Create payload
    const payload = generatePayload(mobileNumber, { amount });
    
    // Generate QR Code
    const options = { type: 'svg', color: { dark: '#000', light: '#fff' } };
    const svg = await qrcode.toString(payload, options);
    
    // Save QR Code to file (optional)
    await fs.writeFile('./qr.svg', svg);
    
    res.status(200).send({ svg, message: 'QR Code saved to file.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.uploadPayment = async (req, res) => {
  try {
    const { providerId, districtId, petId, serviceId, usersId } = req.body;
    if (!req.file && providerId && districtId && petId && serviceId && usersId) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filename = req.file.filename;
    const result = await Admin.putUploadPayment(filename, providerId, districtId, petId, serviceId, usersId);
    if (result && result.affectedRows > 0) {
      res.status(200).json({ message: 'Payment uploaded successfully', data: result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

