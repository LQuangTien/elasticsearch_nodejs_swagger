const express = require("express");
const cors = require("cors");
const config = require("config");
const bodyParser = require("body-parser");
const path = require("path");
const env = require("dotenv");
env.config();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    // info: { title: "Search engine API", version: "1.0.0" },
    openapi: "3.0.0",
    info: {
      title: "Express API for JSONPlaceholder",
      version: "1.0.0",
    },
  },
  apis: ["./routes/routes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const port = process.env.PORT || config.application_serverport;

const elasticsearch = require("./db.js");

const app = express();

app.use(cors());
app.use(express.static("public"));

// app.all('/*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.use(express.json());
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "1000mb" }));

const server = require("http").createServer(app);
const apiRoutes = require("./routes/routes");
app.use("/api", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("", apiRoutes);

app.use((req, res, next) => {
  req.socket.on("error", () => {});
  next();
});

server.on("listening", () => {
  console.log("Server is running");
});

server.listen(port, () => {
  console.log("Server listening at port %d ", port);
});

module.exports = app;
