const db = require("../database.js");

const Service = function(service) {
    this.service_name = service.service_name;
  };

  Service.create = (newService, result) => {
    db.query("INSERT INTO admin_service_service SET ?", newService, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created service: ", { id: res.insertId, ...newService });
      result(null, { id: res.insertId, ...newService });
    });
  };

  Service.getAll = result => {
    db.query("SELECT * FROM admin_service_service", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("admin_service_service: ", res);
      result(null, res);
    });
  };

  Service.updateById = (service_id, service, result) => {
    db.query(
      "UPDATE admin_service_service SET service_name = ? WHERE service_id = ?",
      [service.service_name, service_id],
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
  
        console.log("updated service: ", { service_id: service_id, ...service });
        result(null, { service_id: service_id, ...service });
      }
    );
  };

  Service.removeId = (id, result) => {
    db.query("DELETE FROM admin_service_service WHERE service_id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found service with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted service with id: ", id);
      result(null, res);
    });
  };

module.exports = Service;