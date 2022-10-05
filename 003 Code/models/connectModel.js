var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectSchema = new Schema({
    scene_name:String,
    left_id: {type:mongoose.Schema.ObjectId},
    left_name: String,
    up_id: {type:mongoose.Schema.ObjectId},
    up_name: String,
    right_id: {type:mongoose.Schema.ObjectId},
    right_name: String,
    down_id: {type:mongoose.Schema.ObjectId},
    down_name: String,
});

module.exports = mongoose.model('vr_connection', connectSchema);