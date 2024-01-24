const db = require("../database.js");

const District = function(district) {
    this.district_name = district.district_name;
  };

  District.create = (newDistrict, result) => {
    db.query("INSERT INTO admin_service_district SET ?", newDistrict, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created district: ", { id: res.insertId, ...newDistrict });
      result(null, { id: res.insertId, ...newDistrict });
    });
  };

  District.getAll = result => {
    db.query("SELECT * FROM admin_service_district", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("admin_service_district: ", res);
      result(null, res);
    });
  };

  District.updateById = (id, district, result) => {
    db.query(
      "UPDATE admin_service_district SET district_name = ? WHERE district_id = ?",
      [district.district_name, id],
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
  
        console.log("updated district: ", { id: id, ...district });
        result(null, { id: id, ...district });
      }
    );
  };

  District.removeId = (id, result) => {
    db.query("DELETE FROM admin_service_district WHERE district_id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found district with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted district with id: ", id);
      result(null, res);
    });
  };

module.exports = District;