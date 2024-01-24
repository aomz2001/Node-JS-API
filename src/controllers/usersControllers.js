const Users = require("../models/user/usersModels");

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
  });
  console.log("users", users);

  users.create;

  Users.create(users, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while Signup",
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
