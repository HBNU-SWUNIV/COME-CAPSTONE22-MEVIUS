var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regionSchema = new Schema({
    name: String,
    location: String
});

module.exports = mongoose.model('region', regionSchema);