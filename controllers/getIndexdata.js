const config = require("config");
var elastic_client = require("../db");

const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

exports.getEachIndicesData = function (req, res, next) {
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
