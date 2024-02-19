const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const providerRoutes = require("./src/routes/providerRoutes");
const publicRoutes = require("./src/routes/publicRoutes/publicRoutes");
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

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/provider', providerRoutes);
app.use('/public', publicRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
