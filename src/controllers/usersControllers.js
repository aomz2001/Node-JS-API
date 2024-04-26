const Users = require("../models/user/usersModels");
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const fs = require('fs/promises');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("req.body", req.body);
  // Create a user
  const users = new Users({
    users_email: req.body.users_email,
    users_password: req.body.users_password,
    users_firstname: req.body.users_firstname,
    users_lastname: req.body.users_lastname,
    users_phone: req.body.users_phone,
    users_address: req.body.users_address,
    isAdmin: 0,
  });
  console.log("users", users);

  users.create;

  Users.create(users, (err, data) => {
    if (err)
      res.status(500).send({
        message: "อีเมลนี้มีผู้ใช้งานแล้ว",
      });
    else res.send(data);
  });
};

exports.login = (req, res) => {
  if (!req.body || !req.body.users_email || !req.body.users_password) {
    res.status(400).send({
      message: "Invalid request body!",
    });
    return;
  }

  Users.login(req, res);
};

exports.showUserData = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(400).send({
      message: "Invalid request body!",
    });
    return;
  }
  Users.getUser(token, res);
};

exports.updateUserData = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  Users.updateById(req.params.updateId, new Users(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Users with id ${req.params.updateId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Users with id " + req.params.updateId,
        });
      }
    } else res.send(data);
  });
};

exports.deleteUserData = (req, res) => {
  Users.removeId(req.params.deleteId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Users with id ${req.params.deleteId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Users with id " + req.params.deleteId
          });
        }
      } else res.send({ message: `Users was deleted successfully!` });
  });
};

exports.providerSearch = async (req, res) => {
  try {
    const { district_id, pet_id, service_id } = req.body;

    const result = await Users.searchProvider(
      district_id,
      pet_id,
      service_id
    );

    if (result.length > 0) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(404).json({ success: false, message: "No data found" });
    }
  } catch (error) {
    console.error("Error in providerSearch:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.reqProviderService = async (req, res) => {
  try {
    const { provider_id, district_id, pet_id, service_id, service_price, users_id,booking_first,booking_second,time_first,time_second } = req.body;
    await Users.reqService(provider_id, district_id, pet_id, service_id, service_price, users_id,booking_first,booking_second,time_first,time_second);

    res.status(200).send("ok");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.providerProfile = async (req, res) => {
  try {
    const { district_id, pet_id, service_id, provider_id } = req.body;

    const result = await Users.providerProfile(
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

exports.showUserReview = async (req, res) => {
  try {
    const { provider_id } = req.query;
    const result = await Users.showReview(provider_id);
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

exports.findProvider = async (req, res) => {
  try {
    const { firstname, lastname, id } = req.method === 'POST' ? req.body : req.query;

    const result = await Users.findProvider(firstname, lastname, id);

    if (result.length > 0) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(404).json({ success: false, message: "No data found" });
    }
  } catch (error) {
    console.error("Error in findProvider:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.showAcceptService = async (req, res) => {
  try {
    const { users_id } = req.query;
    const result = await Users.showJob(users_id);
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

exports.deleteAcceptService = async (req, res) => {
  try {
    const { providerId, districtId, petId, serviceId, service_price, usersId } = req.body; 
    await Users.cancelJob(providerId, districtId, petId, serviceId, service_price, usersId);

    res.status(200).send("Service deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.putReportMessage = async (req, res) => {
  try {
    const { report,providerId, districtId, petId, serviceId,service_price, usersId } = req.body;
    const result = await Users.reportProvider(report,providerId, districtId, petId, serviceId,service_price, usersId);
    if (result) {
      res.status(200).json({ message: 'Status Report Message successfully' });
    } else {
      res.status(404).json({ message: 'No matching record found for update' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.understandJobCancel = async (req, res) => {
  try {
    const { providerId, districtId, petId, serviceId, service_price, usersId, provider_cancel } = req.body; 
    await Users.understandJobCancel(providerId, districtId, petId, serviceId, service_price, usersId, provider_cancel);

    res.status(200).send("Request service deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.usersCancelJob = async (req, res) => {
  try {
    const { users_cancel, providerId, districtId, petId, serviceId,service_price, usersId } = req.body;
    const result = await Users.usersCancelJob(users_cancel, providerId, districtId, petId, serviceId,service_price, usersId);
    if (result) {
      res.status(200).json({ message: 'Status Report Message successfully' });
    } else {
      res.status(404).json({ message: 'No matching record found for update' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.generateQRCode = async (req, res) => {
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
    const result = await Users.putUploadPayment(filename, providerId, districtId, petId, serviceId, usersId);
    if (result && result.affectedRows > 0) {
      res.status(200).json({ message: 'Payment uploaded successfully', data: result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.readFile = async (req, res) => {
  try {
    const { payment } = req.query;
    const tmpFolder = path.join(__dirname.replace("\\src\\controllers", ""), 'tmp');
    // ดึงข้อมูลจากฐานข้อมูล
    console.log('tmpFoldertmpFoldertmpFoldertmpFolder', tmpFolder)
    console.log('__dirname', __dirname)
    const result = await Users.showPaymentState(payment);
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

exports.reviewProviderJob = async (req, res) => {
  try {
    const { providerId, usersId, districtId, petId, serviceId, service_price, review_text, ratings } = req.body;
    await Users.reviewJob(providerId, usersId, districtId, petId, serviceId, service_price, review_text, ratings);
    res.status(200).send("ok");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.avgRatings = async (req, res) => {
  try {
    const { provider_id } = req.query;
    const result = await Users.avgRatings(provider_id);
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