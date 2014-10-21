var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var issueSchema = new Schema({
  issueId: Number,
  labels : [{ name: String, date: Date }]
});

module.exports = mongoose.model('Issue', issueSchema);
