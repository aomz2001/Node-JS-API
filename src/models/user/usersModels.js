const db = require("../database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "pawcare-2023";

const Users = function (users) {
  this.users_email = users.users_email;
  this.users_password = users.users_password;
  this.users_firstname = users.users_firstname;
  this.users_lastname = users.users_lastname;
  this.users_phone = users.users_phone;
  this.users_address = users.users_address;
  this.isAdmin = users.isAdmin;
};

Users.create = (newUsers, result) => {
  if (newUsers.users_password) {
    const saltRounds = 10;
    newUsers.users_password = bcrypt.hashSync(
      newUsers.users_password,
      saltRounds
    );
  }

  db.query("INSERT INTO users SET ?", newUsers, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Users.login = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE users_email=? ",
    [req.body.users_email],

    function (err, users, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: "error", message: "no users found" });
        return;
      }
      bcrypt.compare(
        req.body.users_password,
        users[0].users_password,
        function (err, isLogin) {
          if (isLogin) {
            var token = jwt.sign(
              { users_email: users[0].users_email },
              secret,
              {
                expiresIn: "1h",
              }
            );
            const response = {
              status: "ok",
              message: "login success",
              token,
              usersId: users[0].users_id,
              isAdmin: users[0].isAdmin,
            };

            db.query("UPDATE users SET users_cookie =? WHERE users_id=?", [
              token,
              users[0].users_id,
            ]);
            res.json(response);
          } else {
            res.json({ status: "err", message: "login failed" });
          }
        }
      );
    }
  );
};

Users.getUser = (token, res) => {
  db.query(
    "SELECT * FROM users WHERE users_cookie=? ",
    [token],

    function (err, users) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users) {
        res.json({ status: "ok", message: "success", users });
        return;
      }
    }
  );
};

Users.updateById = (users_id, update, result) => {
  db.query(
    "UPDATE users SET users_email = ?,users_firstname = ?,users_lastname = ?,users_phone = ?,users_address = ? WHERE users_id = ?",
    [
      update.users_email,
      update.users_firstname,
      update.users_lastname,
      update.users_phone,
      update.users_address,
      users_id,
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

      console.log("updated users: ", { users_id: users_id, ...update });
      result(null, { users_id: users_id, ...update });
    }
  );
};

Users.removeId = (id, result) => {
  db.query("DELETE FROM users WHERE users_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted users with id: ", id);
    result(null, res);
  });
};

Users.searchProvider = (district_id, pet_id, service_id) => {
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
      ps.service_price,
      ps.booking_start,
      ps.booking_end
    FROM provider_district pd
      LEFT JOIN provider p ON pd.provider_id = p.provider_id
      LEFT JOIN admin_service_district asd ON pd.district_id = asd.district_id
      LEFT JOIN provider_pet pp ON pd.provider_id = pp.provider_id
      LEFT JOIN admin_service_pet asp ON pp.pet_id = asp.pet_id
      LEFT JOIN provider_service ps ON pd.provider_id = ps.provider_id
      LEFT JOIN admin_service_service ass ON ps.service_id = ass.service_id
    WHERE 
      asd.district_id = ?
      AND asp.pet_id = ?
      AND ass.service_id = ?;
    `;
    db.query(queryString, [district_id, pet_id, service_id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

Users.reqService = (
  provider_id,
  district_id,
  pet_id,
  service_id,
  service_price,
  users_id,
  booking_first,
  booking_second,
  time_first,
  time_second
) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "INSERT INTO `req_service` ( `provider_id`, `district_id`, `pet_id`, `service_id`, `service_price`, `users_id`,`booking_first`, `booking_second`,`time_first`, `time_second`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );",
      [
        provider_id,
        district_id,
        pet_id,
        service_id,
        service_price,
        users_id,
        booking_first,
        booking_second,
        time_first,
        time_second
      ],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.providerProfile = (district_id, pet_id, service_id, provider_id) => {
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
      ps.service_price,
      ps.booking_start,
      ps.booking_end
    FROM provider_district pd
      LEFT JOIN provider p ON pd.provider_id = p.provider_id
      LEFT JOIN admin_service_district asd ON pd.district_id = asd.district_id
      LEFT JOIN provider_pet pp ON pd.provider_id = pp.provider_id
      LEFT JOIN admin_service_pet asp ON pp.pet_id = asp.pet_id
      LEFT JOIN provider_service ps ON pd.provider_id = ps.provider_id
      LEFT JOIN admin_service_service ass ON ps.service_id = ass.service_id
    WHERE 
      asd.district_id = ?
      AND asp.pet_id = ?
      AND ass.service_id = ?
      AND p.provider_id = ?;
    `;
    var query = db.query(
      queryString,
      [district_id, pet_id, service_id, provider_id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
    console.log("provider_id", district_id);
    console.log("query", query.sql);
  });
};

Users.showReview = (provider_id) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT
        u.users_id,
        u.users_firstname,
        u.users_lastname,
        p.provider_id,
        r.*
      FROM
        review r
      INNER JOIN
        users u ON r.users_id = u.users_id
      INNER JOIN
        provider p ON r.provider_id = p.provider_id
      WHERE
      p.provider_id =?;
    `;
    db.query(queryString, [provider_id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

Users.findProvider = (firstname, lastname, id) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT DISTINCT
      p.provider_id, 
      p.provider_firstname, 
      p.provider_lastname, 
      pd.district_id, 
      asd.district_name, 
      asp.pet_id, 
      asp.pet_name, 
      ass.service_name, 
      ps.service_id, 
      ps.service_price,
      ps.booking_start,
      ps.booking_end
    FROM provider_district pd
    LEFT JOIN provider p ON pd.provider_id = p.provider_id
    LEFT JOIN admin_service_district asd ON pd.district_id = asd.district_id
    LEFT JOIN provider_pet pp ON pd.provider_id = pp.provider_id
    LEFT JOIN admin_service_pet asp ON pp.pet_id = asp.pet_id
    LEFT JOIN provider_service ps ON pd.provider_id = ps.provider_id
    LEFT JOIN admin_service_service ass ON ps.service_id = ass.service_id
    WHERE CONCAT(p.provider_firstname, ' ', p.provider_lastname) = ?
    OR CONCAT(p.provider_firstname, p.provider_lastname) = ?
    OR p.provider_firstname = ?
    OR p.provider_lastname = ?
    OR p.provider_id = ?;
    `;

    db.query(
      queryString,
      [firstname, lastname, firstname, lastname, id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.showJob = (users_id) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
      SELECT DISTINCT
          u.users_id,
          u.users_firstname,
          u.users_lastname,
          asd.district_id,
          asd.district_name,
          asp.pet_id,
          asp.pet_name,
          ass.service_id,
          ass.service_name,
          aj.service_price,
          aj.payment_status,
          aj.provider_cancel,
          p.provider_id,
          p.provider_firstname,
          p.provider_lastname
      FROM
          accept_job aj
      LEFT JOIN
          users u ON aj.users_id = u.users_id
      LEFT JOIN
          admin_service_district asd ON aj.district_id = asd.district_id
      LEFT JOIN
          admin_service_pet asp ON aj.pet_id = asp.pet_id
      LEFT JOIN
          admin_service_service ass ON aj.service_id = ass.service_id
      LEFT JOIN
          provider_service ps ON aj.service_price = ps.service_price
      LEFT JOIN
          provider p ON aj.provider_id = p.provider_id
      WHERE
          u.users_id = ?;
    `;
    db.query(queryString, [users_id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

Users.cancelJob = (
  providerId,
  districtId,
  petId,
  serviceId,
  service_price,
  usersId
) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    DELETE
    FROM accept_job
    WHERE provider_id = ?
    AND district_id = ?
    AND pet_id = ? 
    AND service_id = ? 
    AND service_price = ?
    AND users_id = ? 
    `;
    db.query(
      queryString,
      [providerId, districtId, petId, serviceId, service_price, usersId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.reportProvider = (
  report,
  providerId,
  districtId,
  petId,
  serviceId,
  service_price,
  usersId
) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    UPDATE accept_job
    SET report = ?
    WHERE provider_id = ?
    AND district_id = ?
    AND pet_id = ?
    AND service_id = ?
    AND service_price = ?
    AND users_id = ?;
    `;
    db.query(
      queryString,
      [
        report,
        providerId,
        districtId,
        petId,
        serviceId,
        service_price,
        usersId,
      ],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.understandJobCancel = (
  providerId,
  districtId,
  petId,
  serviceId,
  service_price,
  usersId,
  provider_cancel
) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    DELETE FROM accept_job
    WHERE provider_id = ?
    AND district_id = ?
    AND pet_id = ? 
    AND service_id = ? 
    AND service_price = ?
    AND users_id = ?  
    AND provider_cancel = ?
    `;
    db.query(
      queryString,
      [
        providerId,
        districtId,
        petId,
        serviceId,
        service_price,
        usersId,
        provider_cancel,
      ],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.usersCancelJob = (
  users_cancel,
  providerId,
  districtId,
  petId,
  serviceId,
  service_price,
  usersId
) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    UPDATE req_service
    SET users_cancel = ?
    WHERE provider_id = ?
    AND district_id = ?
    AND pet_id = ?
    AND service_id = ?
    AND service_price = ?
    AND users_id = ?;
    `;
    db.query(
      queryString,
      [
        users_cancel,
        providerId,
        districtId,
        petId,
        serviceId,
        service_price,
        usersId,
      ],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.putUploadPayment = (
  payment,
  providerId,
  districtId,
  petId,
  serviceId,
  usersId
) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    UPDATE accept_job
    SET payment = ?
    WHERE provider_id = ? 
    AND district_id = ? 
    AND pet_id = ? 
    AND service_id = ? 
    AND users_id = ?;
    `;
    db.query(
      queryString,
      [payment, providerId, districtId, petId, serviceId, usersId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.showPaymentState = (payment) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT DISTINCT
        u.users_id,
        u.users_firstname,
        u.users_lastname,
        asd.district_id,
        asd.district_name,
        asp.pet_id,
        asp.pet_name,
        ass.service_id,
        ass.service_name,
        aj.service_price,
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
    db.query(queryString, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

Users.reviewJob = (
  providerId,
  usersId,
  districtId,
  petId,
  serviceId,
  service_price,
  review_text,
  ratings
) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "INSERT INTO `review` ( `provider_id`, `users_id`,`district_id`, `pet_id`, `service_id`, `service_price`,`review_text`, `ratings`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? );",
      [
        providerId,
        usersId,
        districtId,
        petId,
        serviceId,
        service_price,
        review_text,
        ratings,
      ],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

Users.avgRatings = (provider_id) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `
    SELECT provider_id, AVG(ratings) AS avg_rating
    FROM review
    WHERE provider_id = ?
    GROUP BY provider_id;
    `;
    db.query(queryString, [provider_id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = Users;
