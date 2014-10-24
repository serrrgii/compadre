var express = require('express');
var router = express.Router();
var Issue = require('../models/issue.js');

var LABELED_ACTION = "labeled";

router.post('/webhooks', function(req, res) {
  
  if (req.body.action !== LABELED_ACTION) {
    return res.send(422, "Unable to process this action");
  }  

  var labels = req.body.issue.labels;
  var githubIssue = req.body.issue;

  Issue.findOne({ issueId : githubIssue.id }, function (err, issue) {
    if (err) {
      return res.send(500, "Database error");
    }
    if (issue) {
      issue.processRemoteLabels(labels);
    }
    else {
      Issue.create({ issueId: githubIssue.id }, function (err, issue) {
        if (err) {
	  return res.send(500, "Database error");
	}
	issue.processRemoteLabels(labels);
      }); 
    }
  });
});


module.exports = router;

