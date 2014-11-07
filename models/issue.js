var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require("underscore");

var VALID_LABELS = ["next", "development", "test", "ready"];
var REVERTIBLE = ["test"];
var VALID_ACTIONS = ["labeled", "unlabeled"];

var issueSchema = new Schema({
  issueId: Number,
  labels : [{ name: String, date: Date }]

issueSchema.statics.validateAction = function(action) {
  return _.contains(VALID_ACTIONS, action);	
}

issueSchema.methods.validateLabel = function(label) {
  if (_.contains(VALID_LABELS, label) === false) {
	  return false;
  }
  var labelIndex = _.indexOf(VALID_LABELS, label);
  var splittedLabels = _.partition(VALID_LABELS, function(element) {

    var elementIndex = _.indexOf(VALID_LABELS, element);
    return elementIndex < labelIndex;
  });

  var mandatoryLabels = _.first(splittedLabels);
  var bannedLabels = _.last(splittedLabels);
  var currentLabels = _.pluck(this.labels, 'name');
  
  return validateMandatoryLabels(mandatoryLabels, currentLabels) && 
	  validateBannedLabels(bannedLabels, currentLabels);
}

issueSchema.methods.processRemoteLabels = function(labels) {
  var filtered = filterRemoteLabels(labels);
  var label = _.last(filtered);
  if (this.validateLabel(label)) {
    this.labels.push({ name: label, date: new Date()});
    this.save(function(error) {
      if (error) {
        return console.log("error saving issue: "+error);
      }
      console.log("saved issue: "+this);
    }); 
  }
  else {
    console.log("label: "+label+", validation failed");
  }
}

var filterRemoteLabels = function(labels) {
  return _.intersection(VALID_LABELS, 
	_.pluck(labels, 'name'));
}

var validateMandatoryLabels = function(mandatoryLabels, currentLabels) {
  return _.intersection(mandatoryLabels, currentLabels).length == mandatoryLabels.length;
}

var validateBannedLabels = function(bannedLabels, currentLabels) {
  return _.intersection(bannedLabels, currentLabels).length == 0;	
}

module.exports = mongoose.model('Issue', issueSchema);
