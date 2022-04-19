const config = require("config");
var elastic_client = require("../db");

exports.getAllIndex = async function (req, res) {
  const indices = await elastic_client.cat.indices({ format: "json" });
  return res.status(200).send(indices);
};

exports.getEachIndicesData = async function (req, res, next) {
  const indices = await elastic_client.cat.indices({ format: "json" });
  console.log("indices:", indices);
  elastic_client
    .search({
      index: req.params["index"],
      body: {
        from: 0,
        size: 10000,
        query: {
          match_all: {},
        },
      },
    })
    .then(
      function (response) {
        var hits = response.hits.hits;
        res.status(200).send(hits);
      },
      function (error) {
        console.trace(error.message);
      }
    )
    .catch((err) => {
      console.log("Elasticsearch ERROR - data not fetched");
    });
};

exports.getEachIndicesSingleRecord = function (req, res, next) {
  elastic_client
    .search({
      index: req.body.index,
      body: {
        query: {
          match: { ...req.body.match },
        },
      },
    })
    .then(
      function (response) {
        var hits = response.hits.hits;
        res.status(200).send(hits);
      },
      function (error) {
        console.trace(error.message);
      }
    )
    .catch((err) => {
      console.log("Elasticsearch ERROR - data not fetched");
    });
};
