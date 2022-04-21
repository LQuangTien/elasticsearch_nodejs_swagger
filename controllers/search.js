const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

const config = require("config");
var elastic_client = require("../db");

const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

//filter: term, terms, range, exists, missing, bool(combine must, must_not, should)
exports.multiMatch = async (req, res) => {
  //Tìm data chứa 1 hoặc n chữ có trong input, sẽ sort theo relevance score, nào cao xếp trên
  try {
    const result = await elastic_client.search({
      index: req.body.index,
      _source : {
        includes:req.body.includes
      },
      query: {
        query_string: {
          query: "*"+req.body.input+"*"
        },
      },
    });
    res.status(200).send({ result });
  } catch (err) {
    console.log("err", err.messages);
  }
};

exports.categorizeField = async (req, res) => {
  //Tìm data chứa 1 hoặc n chữ có trong input, sẽ sort theo relevance score, nào cao xếp trên
  try {
    console.log("input", req.query.fieldName);
    const result = await elastic_client.search({
      aggs: {
        count: {
          terms: {
            field: req.query.fieldName,
          },
        },
      },
    });
    res.status(200).send({ result });
  } catch (err) {
    console.log("err", err.messages);
  }
};

// exports.multiMatch = async (req, res) => {
//   //Tìm data chứa 1 hoặc n chữ có trong input, sẽ sort theo relevance score, nào cao xếp trên
//   try {
//     console.log("input", req.query.input, req.query.index);
//     const result = await elastic_client.search({
//       index: req.query.index,
//       query: {
//         multi_match: {
//           query: req.query.input,
//         },
//       },
//     });
//     res.status(200).send({ result });
//   } catch (err) {
//     console.log("err", err.messages);
//   }
// };