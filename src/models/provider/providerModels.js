const db = require("../database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "pawcare-2023";

const Provider = function (provider) {
  this.provider_email = provider.provider_email;
  this.provider_password = provider.provider_password;
  this.provider_firstname = provider.provider_firstname;
  this.provider_lastname = provider.provider_lastname;
  this.provider_phone = provider.provider_phone;
  this.provider_address = provider.provider_address;
};

Provider.create = (newProvider, result) => {
  if (newProvider.provider_password) {
    const saltRounds = 10;
    newProvider.provider_password = bcrypt.hashSync(
      newProvider.provider_password,
      saltRounds
    );
  }

  db.query("INSERT INTO provider SET ?", newProvider, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Provider.login = (req, res) => {
  db.query(
    "SELECT * FROM provider WHERE provider_email=?",
    [req.body.provider_email],

    function (err, provider, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (provider.length == 0) {
        res.json({ status: "error", message: "no provider found" });
        return;
      }
      bcrypt.compare(
        req.body.provider_password,
        provider[0].provider_password,
        function (err, isLogin) {
          if (isLogin) {
            var token = jwt.sign(
              { provider_email: provider[0].provider_email },
              secret,
              {
                expiresIn: "6h",
              }
            );
            const response = {
              status: "ok",
              message: "login success",
              token,
              provider_id: provider[0].provider_id,
            };

            db.query(
              "UPDATE provider SET provider_token =? WHERE provider_id=?",
              [token, provider[0].provider_id]
            );

            res.json(response);
          } else {
            res.json({ status: "err", message: "login failed" });
          }
        }
      );
    }
  );
};

Provider.getProvider = (token, res) => {
  db.query(
    "SELECT * FROM provider WHERE provider_token=? ",
    [token],

    function (err, provider) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (provider) {
        res.json({ status: "ok", message: "success", provider });
        return;
      }
    }
  );
};

Provider.updateById = (provider_id, update, result) => {
  db.query(
    "UPDATE provider SET provider_email = ?,provider_firstname = ?,provider_lastname = ?,provider_phone = ?,provider_address = ? WHERE provider_id = ?",
    [
      update.provider_email,
      update.provider_firstname,
      update.provider_lastname,
      update.provider_phone,
      update.provider_address,
      provider_id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found employee with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated provider: ", {
        provider_id: provider_id,
        ...update,
      });
      result(null, { provider_id: provider_id, ...update });
    }
  );
};

Provider.removeId = (id, result) => {
  db.query("DELETE FROM provider WHERE provider_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted provider with id: ", id);
    result(null, res);
  });
};

Provider.joinDistrict = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "SELECT d.* , pd.provider_id FROM admin_service_district d LEFT JOIN (SELECT * FROM provider_district WHERE provider_id = ?) pd ON pd.district_id = d.district_id;",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.joinedDistrict = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "SELECT d.district_name  FROM admin_service_district d LEFT JOIN provider_district pd ON pd.district_id = d.district_id WHERE pd.provider_id = ? ;",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.BeforePutProvider = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "DELETE FROM `provider_district` WHERE provider_id = ?",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.putProviderDistrict = (provider_id, district_id) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "INSERT INTO `provider_district` ( `provider_id`, `district_id`) VALUES ( ?, ? );",
      [provider_id, district_id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.joinPet = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "SELECT p.*, pp.provider_id FROM admin_service_pet p LEFT JOIN (SELECT * FROM provider_pet WHERE provider_id = ?) pp ON pp.pet_id = p.pet_id;",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.joinedPet = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "SELECT p.pet_name FROM admin_service_pet p LEFT JOIN provider_pet pp ON pp.pet_id = p.pet_id WHERE pp.provider_id = ?;",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.BeforePutProviderPet = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "DELETE FROM `provider_pet` WHERE provider_id = ?",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.putProviderPet = (provider_id, pet_id) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "INSERT INTO `provider_pet` ( `provider_id`, `pet_id`) VALUES ( ?, ? );",
      [provider_id, pet_id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.joinService = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "SELECT s.*, ps.provider_id, ps.service_price FROM admin_service_service s LEFT JOIN ( SELECT * FROM provider_service WHERE provider_id = ?) ps ON ps.service_id = s.service_id;",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.joinedService = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "SELECT s.service_name, ps.service_price, ps.booking_start, ps.booking_end FROM admin_service_service s INNER JOIN provider_service ps ON ps.service_id = s.service_id AND ps.provider_id = ? WHERE now() <= ps.booking_end",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.BeforePutProviderService = (providerId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "DELETE FROM `provider_service` WHERE provider_id = ?",
      providerId,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.putProviderService = (providerId, service_id, service_price, booking_start, booking_end) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "INSERT INTO `provider_service` ( `provider_id`, `service_id`, `service_price`, `booking_start`, `booking_end`) VALUES ( ?, ?, ?, ?, ? );",
      [providerId, service_id, service_price, booking_start, booking_end],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.allTableService = (providerId) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
      SELECT 
        p.provider_id, 
        p.provider_firstname, 
        p.provider_lastname, 
        pd.district_id, 
        asd.district_name, 
        asp.pet_id, 
        asp.pet_name, 
        ass.service_name, 
        ps.service_id, 
        ps.service_price
      FROM provider_district pd
        LEFT JOIN provider p ON pd.provider_id = p.provider_id
        LEFT JOIN admin_service_district asd ON pd.district_id = asd.district_id
        LEFT JOIN provider_pet pp ON pd.provider_id = pp.provider_id
        LEFT JOIN admin_service_pet asp ON pp.pet_id = asp.pet_id
        LEFT JOIN provider_service ps ON pd.provider_id = ps.provider_id
        LEFT JOIN admin_service_service ass ON ps.service_id = ass.service_id
      WHERE p.provider_id IS NOT NULL;
    `;
    db.query(queryString, providerId, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

Provider.beforeReqService = (usersId, districtId, serviceId, petId) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "DELETE FROM `req_service` WHERE users_id = ? AND district_id = ? AND service_id = ? AND pet_id = ?",
      [usersId, districtId, serviceId, petId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.showReqService = (provider_id) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT DISTINCT
        u.users_id,
        u.users_firstname,
        u.users_lastname,
        u.users_address,
        u.users_phone,
        u.users_profile,
        asd.district_id,
        asd.district_name,
        asp.pet_id,
        asp.pet_name,
        ass.service_id,
        ass.service_name,
        rs.*,
        p.provider_id,
        p.provider_firstname,
        p.provider_lastname
    FROM
        req_service rs
    LEFT JOIN
        users u ON rs.users_id = u.users_id
    LEFT JOIN
        admin_service_district asd ON rs.district_id = asd.district_id
    LEFT JOIN
        admin_service_pet asp ON rs.pet_id = asp.pet_id
    LEFT JOIN
        admin_service_service ass ON rs.service_id = ass.service_id
    LEFT JOIN
        provider_service ps ON rs.service_price = ps.service_price
    LEFT JOIN
        provider p ON rs.provider_id = p.provider_id
    WHERE
        p.provider_id = ?;
    `;
    db.query(queryString, [provider_id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

Provider.acceptJob = (
  provider_id,
  district_id,
  pet_id,
  service_id,
  service_price,
  users_id,
  confirm_work
) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "INSERT INTO `accept_job` ( `provider_id`, `district_id`, `pet_id`, `service_id`, `service_price`, `users_id`, confirm_work) VALUES ( ?, ?, ?, ?, ?, ?, ? );",
      [provider_id, district_id, pet_id, service_id, service_price, users_id,confirm_work],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.showPaymentState = (payment) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT DISTINCT
        u.users_id,
        u.users_firstname,
        u.users_lastname,
        u.users_phone,
        asd.district_id,
        asd.district_name,
        asp.pet_id,
        asp.pet_name,
        ass.service_id,
        ass.service_name,
        aj.service_price,
        aj.cash_back,
        CONCAT("/api/get-payment-file\?filename=", aj.payment) as payment,
        aj.job_complete,
        p.provider_id,
        p.provider_firstname,
        p.provider_lastname,
        p.provider_phone,
        aj.report
      FROM
        accept_job aj
      INNER JOIN
        users u ON aj.users_id = u.users_id
      INNER JOIN
        admin_service_district asd ON aj.district_id = asd.district_id
        INNER JOIN
        admin_service_pet asp ON aj.pet_id = asp.pet_id
        INNER JOIN
        admin_service_service ass ON aj.service_id = ass.service_id
        INNER JOIN
        provider_service ps ON aj.service_price = ps.service_price
        INNER JOIN
        provider p ON aj.provider_id = p.provider_id
      WHERE
        aj.payment IS NOT NULL AND aj.payment != "";
    `;
    db.query(queryString,(err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};


Provider.jobComplete = (job_complete, providerId, districtId, petId, serviceId,service_price, usersId) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    UPDATE accept_job
    SET job_complete = ?
    WHERE provider_id = ?
    AND district_id = ?
    AND pet_id = ?
    AND service_id = ?
    AND service_price = ?
    AND users_id = ?;
    `;
    db.query(
      queryString,
      [job_complete, providerId, districtId, petId, serviceId,service_price, usersId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.UploadProfile = (
  provider_profile,
  providerId
) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    UPDATE provider
    SET provider_profile = ?
    WHERE provider_id = ?;
    `;
    db.query(
      queryString,
      [provider_profile, providerId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.showProfile = (providerId) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT 
    provider_id,
    CONCAT("/api/get-provider-profile\?filename=", provider_profile) as provider_profile 
    FROM provider p
    WHERE p.provider_profile IS NOT NULL AND p.provider_profile != "";
    `;
    db.query(queryString,[providerId],(err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

Provider.updateJobstatus = (
  provider_id,
  district_id,
  pet_id,
  service_id,
  service_price,
  users_id,
  provider_cancel
) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "INSERT INTO `accept_job` ( `provider_id`, `district_id`, `pet_id`, `service_id`, `service_price`, `users_id`, `provider_cancel`) VALUES ( ?, ?, ?, ?, ?, ?, ? );",
      [provider_id, district_id, pet_id, service_id, service_price, users_id, provider_cancel],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Provider.showPaymentAdmin = () => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT 
    CONCAT("/api/get-provider-profile\?filename=", payment_admin) as payment_admin 
    FROM req_service rs
    WHERE rs.payment_admin IS NOT NULL AND rs.payment_admin != "";
    `;
    db.query(queryString,(err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = Provider;