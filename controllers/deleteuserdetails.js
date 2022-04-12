const config = require("config");
const chalk = require("chalk");

var elastic_client = require("../db");

exports.deleteSingleData = function (req, res, next) {
  elastic_client
    .delete({
      index: req.body.index,
      id: req.body.id,
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
      console.log("Elasticsearch ERROR - data not present");
    });
};

exports.deleteElasticSearchIndex = function (req, res, next) {
  var esIndexName = req.params.index;
  console.log(esIndexName);
  elastic_client.indices
    .delete({
      index: esIndexName, //delete all indices '_all'
    })
    .then(function (err, response) {
      console.log({ err });
      if (err.acknowledged !== true) {
        console.error(chalk.red(err.message));
        res.send({
          status: 403,
          message: "Indices not present in elasticsearch",
        });
      } else {
        console.log(chalk.yellow("Indices have been deleted!", esIndexName));
        res.send({
          status: 200,
          message: esIndexName + " Indices have been deleted",
        });
      }
    });
};
