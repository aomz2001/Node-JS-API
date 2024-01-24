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
              users_id: users[0].users_id,
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

module.exports = Users;
