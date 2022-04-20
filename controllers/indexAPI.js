const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

const config = require("config");
var elastic_client = require("../db");

const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

//filter: term, terms, range, exists, missing, bool(combine must, must_not, should)
exports.getMapping = async (req, res) => {
  //Tìm data chứa 1 hoặc n chữ có trong input, sẽ sort theo relevance score, nào cao xếp trên
  try {
    console.log("input", req.params.index);
    const result = await elastic_client.indices.getMapping({index:req.params.index});

    console.log(result.blog.mappings.properties)
    const allFieldOfIndex = Object.keys(result[req.params.index].mappings.properties);
    res.status(200).send({ allFieldOfIndex });
  } catch (err) {
    console.log("err", err.messages);
  }
};

exports.createIndex = async (req, res) => {
  //Tìm data chứa 1 hoặc n chữ có trong input, sẽ sort theo relevance score, nào cao xếp trên
  try {
    console.log("test create index", req.body);

    console.log(bodyMapping);
    const result = await client.indices.create({
      index: req.params.index,
      operations: {
        mappings: {
          properties: {
            // id: { type: 'integer' },
            // text: { type: 'text' },
            // user: { type: 'keyword' },
            // time: { type: 'date' }

          }
        }
      }
    });

    res.status(200).send({ result });
  } catch (err) {
    console.log("err", err.messages);
  }
};
