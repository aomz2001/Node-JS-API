const db = require("../database.js");

const Pet = function(pet) {
    this.pet_name = pet.pet_name;
  };

  Pet.create = (newPet, result) => {
    db.query("INSERT INTO admin_service_pet SET ?", newPet, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created pet: ", { id: res.insertId, ...newPet });
      result(null, { id: res.insertId, ...newPet });
    });
  };

  Pet.getAll = result => {
    db.query("SELECT * FROM admin_service_pet", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("admin_service_pet: ", res);
      result(null, res);
    });
  };

  Pet.updateById = (pet_id, pet, result) => {
    db.query(
      "UPDATE admin_service_pet SET pet_name = ? WHERE pet_id = ?",
      [pet.pet_name, pet_id],
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
  
        console.log("updated pet: ", { pet_id: pet_id, ...pet });
        result(null, { pet_id: pet_id, ...pet });
      }
    );
  };

  Pet.removeId = (id, result) => {
    db.query("DELETE FROM admin_service_pet WHERE pet_id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found pet with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted pet with id: ", id);
      result(null, res);
    });
  };

module.exports = Pet;