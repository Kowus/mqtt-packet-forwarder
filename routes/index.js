const express = require("express"),
    router = express.Router(),
    { randomBytes } = require("crypto"),
    { connect } = require("mqtt");

import { mqtt as mqtt_url } from "../config/env";
const client = connect(mqtt_url);

/* GET home page. */
router.get("/", function(req, res, next) {
    res.send(randomBytes(6).toString("hex"));
});

router.post("/:channel", (req, res, next) => {
    client.publish(req.params.channel, req.body.data, err => {
        if (err) return res.status(500).send(err.message);
        return res.status(204).end();
    });
});

module.exports = router;

client.on("error", err => {
    console.error(err);
});

client.on("message", (topic, message) => {
    console.log(`${topic} received ${message}`);
});
