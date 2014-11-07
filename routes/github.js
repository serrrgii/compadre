var express = require('express');
var router = express.Router();
var Issue = require('../models/issue.js');

var LABELED_ACTION = "labeled";

router.post('/webhooks', function(req, res) {
  var action = req.body.action;
  if (Issue.validateAction(action) === false) {
    return res.send(422, "Unable to process this action");
  }  
  console.log("validated action: "+ action);
  var labels = req.body.issue.labels;
  var githubIssue = req.body.issue;

  Issue.findOne({ issueId : githubIssue.id }, function (err, issue) {
    if (err) {
      return res.send(500, "Database error");
    }
    if (issue) {
      issue.processRemoteLabels(labels, action);
    }
    else {
      Issue.create({ issueId: githubIssue.id }, function (err, issue) {
        if (err) {
	  return res.send(500, "Database error");
	}
	issue.processRemoteLabels(labels, action);
      }); 
    }
  });
});


module.exports = router;

