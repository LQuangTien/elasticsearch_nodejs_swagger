const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

const config = require("config");
var elastic_client = require("../db");

const indexName = config.elasticsearch.elasticsearchIndices.STUDENTS.index;
const indexType = config.elasticsearch.elasticsearchIndices.STUDENTS.type;

//filter: term(find exact value, kiểm tra có contain term đó ko), terms, range, exists, missing, bool(combine must, must_not, should)
//full-text search: match(có params là minimum_should_match: đơn vị phần trăm ,operator: and, mặc định k sài thì là or)
exports.partialSearch = async (req, res) => {
  try {
    console.log(
      "input on spec field",
      req.body.index,
      typeof req.body.includes,
      req.body.input,
      req.params.perPage,
      req.params.page
    );
    const searchParams = {
      index: req.body.index,
      size: 10000,
      _source: {
        includes: req.body.includes,
      },
      // sort:[{"ten_field":{"order":"desc hoac asc"}}],
      query: {
        query_string: { 
          query: Number.isInteger(req.body.input) ? req.body.input : "*" + req.body.input + "*",
          // fields: req.body.fields
        }
      }
    };
    searchParams
      && (searchParams.sort = req.body.sort)
      && (searchParams.query.query_string.fields = req.body.fields)
    // if (req.body.sort) searchParams.sort = req.body.sort;
    // if (req.body.fields) searchParams.query.query_string.fields = req.body.fields;

    const result = await elastic_client.search(searchParams);
    console.log("result on spec field", result.hits);
    const formatResult = pagination(
      result.hits.hits,
      req.params.page,
      req.params.perPage
    );
    // console.log("fuck2",test)
    res.status(200).send({ formatResult });
  } catch (err) {
    console.log("err1", err);
  }
};

exports.categorizeField = async (req, res) => {
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

function pagination(items, page = 1, perPage = 8) {
  const previousItem = (page - 1) * Number(perPage);
  return {
    result: {
      items: items.slice(previousItem, previousItem + Number(perPage)),
      totalPage: Math.ceil(items.length / Number(perPage)),
      currentPage: page,
      totalItem: items.length,
    },
  };
}
