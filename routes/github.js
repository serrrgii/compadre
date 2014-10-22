var express = require('express');
var router = express.Router();
var Issue = require('../models/issue.js');

router.post('/webhooks', function(req, res) {
  
  var labels = req.body.issue.labels;
  var filteredLabels = Issue.filterRemoteLabels(labels);

  console.log("issue action: "+req.body.action+"\n"+
    "labels: "+JSON.stringify(labels)+"\n"+
    "filtered labels: "+filteredLabels.length);
  
  var githubIssue = req.body.issue;

  Issue.findOne({ issueId : githubIssue.id }, function (err, issue) {
    if (err) {
      res.send(500, "Database error");
    }
    if (issue) {
      console.log("issue found: "+issue+"\n");
      

      issue.validateLabel(filteredLabels.last);
    }
    else {
      console.log("did not find issue with id: "+githubIssue.id);
      Issue.create({ issueId: githubIssue.id }, function (err, issue) {
        if (err) {
	  res.send(500, "Database error");
	}
	console.log("created issue "+issue);
      }); 
    }
  });
});


module.exports = router;

