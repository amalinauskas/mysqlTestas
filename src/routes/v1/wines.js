const express = require("express");
const mysql = require("mysql2/promise");
const Joi = require("joi");
const jsonwebtoken = require("jsonwebtoken");

const { mysqlConfig } = require("../../config");
const isLoggedIn = require("../../middleware/auth");
const validation = require("../../middleware/validation");

const router = express.Router();

const winesSchema = Joi.object({
  title: Joi.string().trim().required(),
  region: Joi.string().trim().required(),
  year: Joi.number().required(),
});

router.get("/wines", isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute("SELECT * FROM wines");
    await con.end();

    return res.send(data);
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Server issue occurred. Please try again later." });
  }
});

router.post("/wines", isLoggedIn, validation(winesSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(`
  
  INSERT INTO wines (title, region, year)
  
  VALUES (${mysql.escape(req.body.title)}, ${mysql.escape(req.body.region)},
  
  ${mysql.escape(req.body.year)})`);

    await con.end();

    if (!data.insertId) {
      return res.status(500).send({ err: "Please try again" });
    }

    return res.send({ msg: "Successfully added Wine" });
  } catch (err) {
    return res
      .status(500)
      .send({ err: "Server issue occured. Please try again later" });
  }
});

module.exports = router;
