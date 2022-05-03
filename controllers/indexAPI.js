const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

const config = require("config");
var elastic_client = require("../db");

// const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
// const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

exports.getMapping = async (req, res) => {
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
  try {
    const test = {
      index: req.params.index,
      operations: {
        mappings: {
          properties: req.body
        }
      }
    }
    console.log("test create index",test.operations.mappings);

    const result = await elastic_client.indices.create({
      index: req.params.index,
      // operations: {
        mappings: {
          properties: req.body
        }
      // }
    });

    res.status(200).send({ result })
  } catch(err) {
    console.log(err)
  }
    // res.status(200).send({ result });

};
/*
{
            id: { type: 'integer' },
            text: { type: 'text' },
            user: { type: 'keyword' },
            time: { type: 'date' }
          }
          */
