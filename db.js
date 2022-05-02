const { Client } = require("@elastic/elasticsearch");
const config = require("config");
const client = new Client({
  node: config.elasticsearch.url + "" + config.elasticsearch.port,
  auth: {
    username: "elastic",
    password: process.env.PASSWORD,
  },
  tls: {
    // might be required if it's a self-signed certificate
    rejectUnauthorized: false,
  },
  requestTimeout: 9999999,
});
module.exports = client;
