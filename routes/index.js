const express = require('express'),
  router = express.Router(),
  { randomBytes } = require('crypto'),
  { connect } = require('mqtt'),
  { mqtt } = require('../config/env'),
  client = connect(mqtt.url),
  debug = require('debug')('packet-forwarder:index.js');

/* GET home page. */
// router.get("/", function(req, res, next) {
//     res.send(randomBytes(12).toString("hex"));
// });

client.once('connect', () => {
  debug('MQTT client connected.');
  client.subscribe('lockstatus', (err, granted) => {
    if (err) return debug(err);
    debug(`Connected to ${granted[0].topic}`);
  });
});

router.post('/:channel', (req, res, next) => {
  debug(req.body.data);
  client.publish(req.params.channel, req.body.data, err => {
    if (err) {
      debug(err);
      return res.status(500).send(err.message);
    }
    return res.status(204).end();
  });
});

router.get('/stream', (req, res) => {
  req.socket.setTimeout(Number.MAX_SAFE_INTEGER);
  // req.socket.setTimeout((i *= 6));

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');

  var timer = setInterval(() => {
    res.write(':' + '\n');
  }, 18000);

  // When the data arrives, send it in the form
  client.on('message', (topic, message) => {
    // if (topic == process.env.MQTT_CHANNEL)
    res.write('data:' + message + '\n\n');
  });

  req.on('close', () => {
    clearTimeout(timer);
  });
});

module.exports = router;

client.on('error', err => {
  console.error(err);
});

client.on('message', (topic, message) => {
  console.log(`${topic} received ${message}`);
});
