const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const corsOptions = {
  origin: 'http://localhost:5173',  // กำหนด Origin ของเว็บไซต์ของคุณ
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({ message: "Back-end API" });
});

require("./src/routes/userRoutes")(app);
require("./src/routes/adminRoutes")(app);
require("./src/routes/providerRoutes")(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
