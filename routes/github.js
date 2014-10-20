var express = require('express');
var router = express.Router();

router.post('/webhooks', function(req, res) {
  console.log(req.body);
});

module.exports = router;

