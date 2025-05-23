const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");

router.get("/intentional", errorController.buildError);

module.exports = router;
