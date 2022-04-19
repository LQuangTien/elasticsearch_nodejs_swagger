const express = require("express");
const router = express.Router();
const client = require("../db");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const getindicesData = require("../controllers/getIndexdata");
const insertApi = require("../controllers/registration");
const updateApi = require("../controllers/userdetailsupdate");
const deleteApi = require("../controllers/deleteuserdetails");
const searchAPI =  require("../controllers/search");
const aggregateAPI =  require("../controllers/aggregate"); 
//Testing
router.get("/", async (req, res) => {
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
router.get("/search/alldata/:index", getindicesData.getEachIndicesData);

router.get("/getAllIndex", getindicesData.getAllIndex);


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
router.post("/search/single/data", getindicesData.getEachIndicesSingleRecord);

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
router.post("/insert/single/data", insertApi.insertSingleData);

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
router.put("/update/single/data", updateApi.updateSingleData);

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
router.delete("/delete/single/data", deleteApi.deleteSingleData);


router.post("/bulk/data", upload.single("dataFile"), insertApi.bulkData);
router.get("/search/multiMatch",searchAPI.multiMatch);
router.get("/search/categorizeField",searchAPI.categorizeField);

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
router.delete("/delete/:index", deleteApi.deleteElasticSearchIndex);

module.exports = router;
