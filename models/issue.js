var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require("underscore");

var VALID_LABELS = ["next", "development", "done", "ready"];

var issueSchema = new Schema({
  issueId: Number,
  labels : [{ name: String, date: Date }]
});

issueSchema.methods.validateLabel = function(label) {
  console.log("validate label: "+label);
  if (_.contains(VALID_LABELS, label) === false) {
	  return false;
  }
  var labelIndex = _.indexOf(VALID_LABELS, label);
  var otherLabels = _.without(VALID_LABELS, label);
  var splittedLabels = _.partition(otherLabels, function(element) {
    var elementIndex = _.indexOf(otherLabels, element);
    return elementIndex < labelIndex;
  });
  console.log("splitted labels: "+splittedLabels);  
}

issueSchema.methods.processRemoteLabels = function(labels) {
  var filtered = filterRemoteLabels(labels);
  if (validateLabel(_.last(filtered)) {
  }
}

issueSchema.statics.filterRemoteLabels = function(labels) {
  return filterRemoteLabels(labels);
}

var filterRemoteLabels = function(labels) {
  return _.intersection(VALID_LABELS, 
	_.pluck(labels, 'name'));
}

module.exports = mongoose.model('Issue', issueSchema);
