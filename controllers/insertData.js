const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

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

exports.newData = async function (req, res) {
  try {
    const isExisted = elastic_client.indices.exists(req.body.index);
    if(isExisted) res.status(400).send("Index has been existed");
    
    if (req.body.mapping) {
      const result = await elastic_client.indices.create({
        index: req.body.index,
        // operations: {
        mappings: {
          properties: JSON.parse(req.body.mapping)
        }
        // }
      });
    }

    const filter = `[.[] | {"index": {"_index": "${req.body.index}"}}, .]`;
    const jsonPath = path.join(
      __dirname,
      "..",
      `public/uploads/${req.file.filename}`
    );
    const options = {};

    jq.run(filter, jsonPath, options)
      .then(async (output) => {
        output = JSON.parse(output);

        console.log(output)
        const bulkResponse = await elastic_client.bulk({
          refresh: true,
          body: output,
        });

        // if (bulkResponse.errors) {
        //   const erroredDocuments = [];
        //   bulkResponse.items.forEach((action, i) => {
        //     const operation = Object.keys(action)[0];
        //     if (action[operation].error) {
        //       erroredDocuments.push({
        //         status: action[operation].status,
        //         error: action[operation].error,
        //         operation: body[i * 2],
        //         document: body[i * 2 + 1],
        //       });
        //     }
        //   });
        //   console.log(erroredDocuments);
        // }

        const count = await elastic_client.count({ index: req.body.index });
        fs.unlinkSync(jsonPath);
        res.status(200).send({ count });
      })
      // .catch((err) => {
      //   if (err.meta.statusCode==='400') res.status(400).send("Index has been existed")
      // });

    res.status(200).send({ result })
  } catch (err) {
    console.log(err);
    
  }
};

exports.bulkData = async function (req, res) {
  try {
    if (req.body.mapping) {
      const result = await elastic_client.indices.create({
        index: req.body.index,
        // operations: {
        mappings: {
          properties: JSON.parse(req.body.mapping)
        }
        // }
      });
    }

    const filter = `[.[] | {"index": {"_index": "${req.body.index}"}}, .]`;
    const jsonPath = path.join(
      __dirname,
      "..",
      `public/uploads/${req.file.filename}`
    );
    const options = {};

    jq.run(filter, jsonPath, options)
      .then(async (output) => {
        output = JSON.parse(output);

        console.log(output)
        const bulkResponse = await elastic_client.bulk({
          refresh: true,
          body: output,
        });

        // if (bulkResponse.errors) {
        //   const erroredDocuments = [];
        //   bulkResponse.items.forEach((action, i) => {
        //     const operation = Object.keys(action)[0];
        //     if (action[operation].error) {
        //       erroredDocuments.push({
        //         status: action[operation].status,
        //         error: action[operation].error,
        //         operation: body[i * 2],
        //         document: body[i * 2 + 1],
        //       });
        //     }
        //   });
        //   console.log(erroredDocuments);
        // }

        const count = await elastic_client.count({ index: req.body.index });
        fs.unlinkSync(jsonPath);
        res.status(200).send({ count });
      })
      .catch((err) => {
        console.error(err);
        // res.status(400).send("index has been existed")
      });

    res.status(200).send({ result })
  } catch (err) {
    console.log(err)
  }
};

function formatFileForBulkData(filePath) {
  // const filter = '[.[] | {"index": {"_index": "blog"}}, .]'
  // const jsonPath = 'test.json'
  // const options = {}
  // jq.run(filter, jsonPath, options)
  //   .then((output) => {
  //     fs.writeFile("../output.json", output, function (err) {
  //       if (err) {
  //         console.log(err);
  //       }
  //       console.log("The file was saved!");
  //     });
  //     console.log(output)
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //     // Something went wrong...
  //   })
}

function readFile(filePath) {
  // to read json files
  var fs = require("fs");
  // Start reading the json file
  fs.readFile("DocRes.json", { encoding: "utf-8" }, function (err, data) {
    if (err) {
      throw err;
    }

    // Build up a giant bulk request for elasticsearch.
    bulk_request = data.split("\n").reduce(function (bulk_request, line) {
      var obj, ncar;

      try {
        obj = JSON.parse(line);
      } catch (e) {
        console.log("Done reading 1");
        return bulk_request;
      }

      // Rework the data slightly
      ncar = {
        id: obj.id,
        name: obj.name,
        summary: obj.summary,
        image: obj.image,
        approvetool: obj.approvetool,
        num: obj.num,
        date: obj.date,
      };

      bulk_request.push({
        index: { _index: "ncar_index", _type: "ncar", _id: ncar.id },
      });
      bulk_request.push(ncar);
      return bulk_request;
    }, []);

    // A little voodoo to simulate synchronous insert
    var busy = false;
    var callback = function (err, resp) {
      if (err) {
        console.log(err);
      }

      busy = false;
    };

    // Recursively whittle away at bulk_request, 1000 at a time.
    var perhaps_insert = function () {
      if (!busy) {
        busy = true;
        client.bulk(
          {
            body: bulk_request.slice(0, 1000),
          },
          callback
        );
        bulk_request = bulk_request.slice(1000);
        console.log(bulk_request.length);
      }

      if (bulk_request.length > 0) {
        setTimeout(perhaps_insert, 100);
      } else {
        console.log("Inserted all records.");
      }
    };

    perhaps_insert();
  });
}



