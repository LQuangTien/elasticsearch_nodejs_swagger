const config = require("config");
var elastic_client = require("../db");

exports.updateSingleData = function (req, res, next) {
  elastic_client
    .update({
      index: req.body.index,
      id: req.body.id,
      body: {
        doc: {
          title: req.body.title,
          content: req.body.content,
        },
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
      console.log("Elasticsearch ERROR - data not updated");
    });
};
