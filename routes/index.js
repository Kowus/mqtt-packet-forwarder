const express = require("express"),
    router = express.Router(),
    { randomBytes } = require("crypto"),
    { connect } = require("mqtt");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.send(randomBytes(6).toString("hex"));
});

module.exports = router;
