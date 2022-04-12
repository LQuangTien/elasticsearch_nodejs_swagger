const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const client = require("../db");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    // info: { title: "Search engine API", version: "1.0.0" },
    openapi: "3.0.0",
    info: {
      title: "Express API for JSONPlaceholder",
      version: "1.0.0",
    },
  },
  apis: ["./routes/routes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use("/api", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const getindicesData = require("../controllers/getIndexdata");
const insertApi = require("../controllers/registration");
const updateApi = require("../controllers/userdetailsupdate");
const deleteApi = require("../controllers/deleteuserdetails");

//Testing
app.get("/", async (req, res) => {
  //done
  try {
    //  const result = await client.search({
    //    index: "blog",
    //  });
    res.send({
      status: 200,
      message: "API is working fine!",
    });
  } catch (err) {
    console.trace(err);
  }
});

/**
 * @swagger
 * paths:
 *   /bulk/data:
 *    get:
 *      summary: Get all data of index
 *      responses:
 *        200:
 *          description: Success
 */
app.get("/bulk/data", insertApi.bulkData);

/**
 * @swagger
 * paths:
 *   /search/alldata/{index}:
 *    get:
 *      summary: Get all data of index
 *      parameters:
 *        - in: path
 *          name: index
 *          schema:
 *            type: string
 *            required: true
 *            description: index name
 *      responses:
 *        200:
 *          description: Success
 */
app.get("/search/alldata/:index", getindicesData.getEachIndicesData);

/**
 * @swagger
 * /search/single/data:
 *   post:
 *     summary: Search a document by query.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: string
 *                   example: blog
 *                 match:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: object
 *                       description: query option.
 *                       example: {
 *                          title: "blog",
 *                       }
 */
app.post("/search/single/data", getindicesData.getEachIndicesSingleRecord);

/**
 * @swagger
 * /insert/single/data:
 *   post:
 *     summary: Add a single data.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: string
 *                   example: blog
 *                 title:
 *                   type: string
 *                   example: blog a
 *                 content:
 *                   type: string
 *                   example: content a
 *     responses:
 *       201:
 *         description: created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: string
 *                   example: blog
 *                 title:
 *                   type: string
 *                   example: blog a
 *                 content:
 *                   type: string
 *                   example: content a
 */
app.post("/insert/single/data", insertApi.insertSingleData);

/**
 * @swagger
 * /update/single/data:
 *   put:
 *     summary: Update a single data.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: string
 *                   example: blog
 *                 id:
 *                   type: string
 *                   example: Bxt6F4ABDlrQx5DLjzR0
 *                 title:
 *                   type: string
 *                   example: blog a
 *                 content:
 *                   type: string
 *                   example: content a
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: string
 *                   example: blog
 *                 id:
 *                   type: string
 *                   example: Bxt6F4ABDlrQx5DLjzR0
 *                 title:
 *                   type: string
 *                   example: blog a
 *                 content:
 *                   type: string
 *                   example: content a
 */
app.put("/update/single/data", updateApi.updateSingleData);

/**
 * @swagger
 * /delete/single/data:
 *   delete:
 *     summary: Delete a single data.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: string
 *                   example: blog
 *                 id:
 *                   type: string
 *                   example: Bxt6F4ABDlrQx5DLjzR0
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: string
 *                   example: blog
 *                 id:
 *                   type: string
 *                   example: Bxt6F4ABDlrQx5DLjzR0
 */
app.delete("/delete/single/data", deleteApi.deleteSingleData);

/**
 * @swagger
 * paths:
 *   /delete/{index}:
 *    delete:
 *      summary: Delete index
 *      parameters:
 *        - in: path
 *          name: index
 *          schema:
 *            type: string
 *            required: true
 *            description: index name
 *      responses:
 *        200:
 *          description: Deleted
 */
app.delete("/delete/:index", deleteApi.deleteElasticSearchIndex);

module.exports = app;
