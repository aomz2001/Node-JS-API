const Provider = require("../models/provider/providerModels");
// const generatePayload = require('promptpay-qr');
// const qrcode = require('qrcode');
// const fs = require('fs/promises');
const path = require('path');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("req.body", req.body);
  // Create a provider
  const provider = new Provider({
    provider_email: req.body.provider_email,
    provider_password: req.body.provider_password,
    provider_firstname: req.body.provider_firstname,
    provider_lastname: req.body.provider_lastname,
    provider_phone: req.body.provider_phone,
    provider_address: req.body.provider_address,
  });
  console.log("provider", provider);

  provider.create;

  Provider.create(provider, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while Signup",
      });
    else res.send(data);
  });
};

exports.login = (req, res) => {
  if (!req.body || !req.body.provider_email || !req.body.provider_password) {
    res.status(400).send({
      message: "Invalid request body!",
    });
    return;
  }

  Provider.login(req, res);
};

exports.showProviderData = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(400).send({
      message: "Invalid request body!",
    });
    return;
  }
  Provider.getProvider(token, res);
};

exports.updateProviderData = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  Provider.updateById(
    req.params.updateId,
    new Provider(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Provider with id ${req.params.updateId}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Provider with id " + req.params.updateId,
          });
        }
      } else res.send(data);
    }
  );
};

exports.deleteProviderData = (req, res) => {
  Provider.removeId(req.params.deleteId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Provider with id ${req.params.deleteId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Provider with id " + req.params.deleteId,
        });
      }
    } else res.send({ message: `Provider was deleted successfully!` });
  });
};

exports.showProviderDistrict = async (req, res) => {
  try {
    const { providerId } = req.params;
    const joined = await Provider.joinedDistrict(providerId);
    const data = await Provider.joinDistrict(providerId);
    res.status(200).send({
      districtList: data.map((i) => ({
        district_id: i.district_id,
        district_name: i.district_name,
        checked: i.provider_id ? true : false,
      })),
      district: joined.map((i) => i.district_name).join(", "),
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.putProviderDistrict = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { districtList } = req.body;
    await Provider.BeforePutProvider(providerId);
    for (let district_id of districtList) {
      await Provider.putProviderDistrict(providerId, district_id);
    }
    res.status(200).send("ok");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.showProviderPet = async (req, res) => {
  try {
    const { providerId } = req.params;
    const joinedPet = await Provider.joinedPet(providerId);
    const data = await Provider.joinPet(providerId);
    res.status(200).send({
      petList: data.map((i) => ({
        pet_id: i.pet_id,
        pet_name: i.pet_name,
        checked: i.provider_id ? true : false,
      })),
      pet: joinedPet.map((i) => i.pet_name).join(", "),
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.putProviderPet = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { petList } = req.body;
    await Provider.BeforePutProviderPet(providerId);
    for (let pet_id of petList) {
      await Provider.putProviderPet(providerId, pet_id);
    }
    res.status(200).send("ok");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.showProviderService = async (req, res) => {
  try {
    const { providerId } = req.params;
    const joinedService = await Provider.joinedService(providerId);
    const data = await Provider.joinService(providerId);

    const serviceList = data.map((i) => ({
      service_id: i.service_id,
      service_name: i.service_name,
      checked: i.provider_id ? true : false,
      service_price: i.service_price,
    }));
    const service = joinedService.map((i) => ({
      service_name: i.service_name,
      service_price: i.service_price,
      booking_start: i.booking_start,
      booking_end: i.booking_end,
    }));
    res.status(200).send({
      serviceList,
      service,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.putProviderService = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { serviceList } = req.body;
    await Provider.BeforePutProviderService(providerId);
    for (let { service_id, service_price, booking_start, booking_end } of serviceList) {
      await Provider.putProviderService(providerId, service_id, service_price, booking_start, booking_end);
    }
    res.status(200).send("ok");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.providerAllService = async (req, res) => {
  try {
    // const providerId = req.params.providerId;
    const providerId = req.body.providerId;
    const result = await Provider.allTableService(providerId);
    if (result.length > 0) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(404).json({ success: false, message: "No data found" });
    }
  } catch (error) {
    console.error("Error in providerAllService:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.providerProfile = async (req, res) => {
  try {
    const { district_id, pet_id, service_id, provider_id } = req.body;

    const result = await Provider.providerProfile(
      district_id,
      pet_id,
      service_id,
      provider_id
    );

    if (result.length > 0) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(404).json({ success: false, message: "No data found" });
    }
  } catch (error) {
    console.error("Error in providerProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.showReqService = async (req, res) => {
  try {
    const { provider_id } = req.query; 
    const result = await Provider.showReqService(provider_id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).send({
      data: result,
      message: 'Data retrieved successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.deleteReqService = async (req, res) => {
  try {
    const { usersId, districtId, serviceId, petId } = req.body; 
    await Provider.beforeReqService(usersId, districtId, serviceId, petId);

    res.status(200).send("Request service deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.acceptJobUsers = async (req, res) => {
  try {
    const { provider_id, district_id, pet_id, service_id, service_price, users_id, provider_cancel } = req.body;
    await Provider.acceptJob(provider_id, district_id, pet_id, service_id, service_price, users_id, provider_cancel);

    res.status(200).send("ok");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.readFile = async (req, res) => {
  try {
    const { payment } = req.query;
    const tmpFolder = path.join(__dirname.replace("\\src\\controllers", ""), 'tmp');
    // ดึงข้อมูลจากฐานข้อมูล
    console.log('tmpFoldertmpFoldertmpFoldertmpFolder', tmpFolder)
    console.log('__dirname', __dirname)
    const result = await Provider.showPaymentState(payment);
    res.status(200).send({
      data: result,
      message: 'Data retrieved successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getPaymentFile= async (req, res) => {
  try {
    const { filename } = req.query;
    const tmpFolder = path.join(__dirname.replace("\\src\\controllers", ""), 'tmp');
    res.sendFile(path.join(tmpFolder, filename))
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.putStatusWork = async (req, res) => {
  try {
    const { status_work, providerId, districtId, petId, serviceId,service_price, usersId } = req.body;
    const result = await Provider.updateReq(status_work, providerId, districtId, petId, serviceId,service_price, usersId);
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

exports.jobComplete = async (req, res) => {
  try {
    const { job_complete, providerId, districtId, petId, serviceId,service_price, usersId } = req.body;
    const result = await Provider.jobComplete(job_complete, providerId, districtId, petId, serviceId,service_price, usersId);
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