const db = require("../database.js");

const Price = function(price) {
    this.price_name = price.price_name;
  };

  Price.create = (newPrice, result) => {
    db.query("INSERT INTO admin_service_price SET ?", newPrice, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created pet: ", { id: res.insertId, ...newPrice });
      result(null, { id: res.insertId, ...newPrice });
    });
  };

  Price.getAll = result => {
    db.query("SELECT * FROM admin_service_price", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("admin_service_price: ", res);
      result(null, res);
    });
  };

  Price.updateById = (price_id, price, result) => {
    db.query(
      "UPDATE admin_service_price SET price_name = ? WHERE price_id = ?",
      [price.price_name, price_id],
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
  
        console.log("updated price: ", { price_id: price_id, ...price });
        result(null, { price_id: price_id, ...price });
      }
    );
  };

  Price.removeId = (id, result) => {
    db.query("DELETE FROM admin_service_price WHERE price_id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found price with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted price with id: ", id);
      result(null, res);
    });
  };

module.exports = Price;