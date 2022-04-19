const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

const config = require("config");
var elastic_client = require("../db");

const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

exports.groupDataByField = async (req, res) => {
    //Tìm data chứa chữ có trong input và tô đậm vị trí data có input
    try {
        const result = await elastic_client.search({
            aggs: {
                all_interests: {
                    term: { field: interests }
                }
            }
        })
        res.status(200).send({ result });
    } catch (err) {
        console.log(err.messages)
    }

}