const { Client } = require("@elastic/elasticsearch");
const config = require("config");
const client = new Client({
  node: config.elasticsearch.url + "" + config.elasticsearch.port,
  auth: {
    username: "elastic",
    password: "5BI5Ya6TzbBPzQ53AsYe",
  },
  tls: {
    // might be required if it's a self-signed certificate
    rejectUnauthorized: false,
  },
});
module.exports = client;
