const db = require("../database.js");

const Admin = function (users) {
    this.users_email = users.users_email;
    this.users_password = users.users_password;
    this.users_firstname = users.users_firstname;
    this.users_lastname = users.users_lastname;
    this.users_phone = users.users_phone;
    this.users_address = users.users_address;
  };

  Admin.paymentStatus = (payment_status, providerId, districtId, petId, serviceId,service_price, usersId) => {
    return new Promise(async (resolve, reject) => {
      const queryString = `
      UPDATE accept_job
      SET payment_status = ?
      WHERE provider_id = ?
      AND district_id = ?
      AND pet_id = ?
      AND service_id = ?
      AND service_price = ?
      AND users_id = ?;
      `;
      db.query(
        queryString,
        [payment_status, providerId, districtId, petId, serviceId,service_price, usersId],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  };

  Admin.updateReq = (status_work, providerId, districtId, petId, serviceId,service_price, usersId) => {
    return new Promise(async (resolve, reject) => {
      const queryString = `
      UPDATE req_service
      SET status_work = ?
      WHERE provider_id = ?
      AND district_id = ?
      AND pet_id = ?
      AND service_id = ?
      AND service_price = ?
      AND users_id = ?;
      `;
      db.query(
        queryString,
        [status_work, providerId, districtId, petId, serviceId,service_price, usersId],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  };

  Admin.clearWorklist = (usersId, districtId, serviceId, petId, service_price) => {
    return new Promise(async (resolve, reject) => {
      db.query(
        "DELETE FROM `accept_job` WHERE users_id = ? AND district_id = ? AND service_id = ? AND pet_id = ? AND service_price = ?",
        [usersId, districtId, serviceId, petId, service_price],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  };

module.exports = Admin;