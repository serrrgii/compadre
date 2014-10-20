var express = require('express');
var router = express.Router();

router.post('/webhooks', function(req, res) {
  console.log("issue action: "+req.body.action+"\n"+
	  "labels: "+JSON.stringify(req.body.issue.labels));
});

module.exports = router;

