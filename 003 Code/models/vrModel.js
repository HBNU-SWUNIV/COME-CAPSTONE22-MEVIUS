var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vrSchema = new Schema({
    region_id: { type: mongoose.Schema.ObjectId },
    scene_name: String,
    image_file: String,
    left_name: String,
    up_name: String,
    right_name: String,
    down_name: String,
    links: {
        left: { name: String, x: Number, y: Number, z: Number, yaw: Number, pitch: Number, roll: Number },
        up: { name: String, x: Number, y: Number, z: Number, yaw: Number, pitch: Number, roll: Number },
        right: { name: String, x: Number, y: Number, z: Number, yaw: Number, pitch: Number, roll: Number },
        down: { name: String, x: Number, y: Number, z: Number, yaw: Number, pitch: Number, roll: Number },
        default: false
    },
    boxtest: [new mongoose.Schema({
        x: Number, y: Number, z: Number,
        yaw: Number, pitch: Number, roll: Number,
        xscale: Number, yscale: Number, zscale: Number,
        id: String, loc: String, geometry: String, color: String, opacity: Number
    })],
    linkobject: [new mongoose.Schema({
        x: Number, y: Number, z: Number,
        yaw: Number, pitch: Number, roll: Number,
        xscale: Number, yscale: Number, zscale: Number,
        id: String, loc: String, geometry: String, color: String, opacity: Number,
        class: String, herf: String,
        name: String, nwidth: Number, nalign: String, nanchor: String, nbaseline: String
    })],
});

module.exports = mongoose.model('vrItem', vrSchema);
