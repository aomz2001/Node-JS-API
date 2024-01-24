module.exports = app => {
    const users = require("../controllers/usersControllers");

    app.post("/signup", users.create);
    
    app.post("/login", users.login);

    app.get("/users-data", users.showUserData);

    app.put("/users-data/:updateId", users.updateUserData);

    app.delete("/users-data/:deleteId", users.deleteUserData);
  };