const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

const config = require("config");
var elastic_client = require("../db");

const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

//filter: term, terms, range, exists, missing, bool(combine must, must_not, should)
exports.match = async (req, res) => {
    //Tìm data chứa 1 hoặc n chữ có trong input, sẽ sort theo relevance score, nào cao xếp trên
    try {
        console.log("input",req.query.input)
        const result = await elastic_client.search({
            query: {
                multi_match: {
                    query:req.query.input
                }
            }
        })
        res.status(200).send({ result });
    } catch (err) {
        console.log("err",err.messages)
    }

}

exports.searchDataContainWordInInput = async (req, res) => {
    //Tìm data chứa 1 hoặc n chữ có trong input, sẽ sort theo relevance score, nào cao xếp trên
    try {
        console.log("input",req.query.input)
        const result = await elastic_client.search({
            query: {
                multi_match: {
                    query:req.query.input
                }
            },
            highlight: {
                query: {
                    multi_match: {}
                }
            }
        })
        res.status(200).send({ result });
    } catch (err) {
        console.log("err",err.messages)
    }

}