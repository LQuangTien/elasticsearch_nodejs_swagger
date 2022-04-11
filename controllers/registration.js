const config = require("config");
var elastic_client = require("../db");

const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

exports.insertSingleData = function (req, res, next) {
  elastic_client
    .index({
      index: req.body.index,
      body: {
        title: req.body.title,
        content: req.body.content,
      },
    })
    .then(
      function (response) {
        var hits = response;
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
