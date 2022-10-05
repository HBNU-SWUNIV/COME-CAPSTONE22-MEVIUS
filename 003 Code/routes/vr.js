var express = require('express');
var router = express.Router();
var VRItem = require('../models/vrModel');
var Connections = require('../models/connectModel')
var mongoose = require('mongoose');

var Region = require('../models/regionModel');
var VRModel = require('../models/vrModel')

/* GET home page. */
//router.get('/', function(req, res, next) {
//    res.render('vr', { title: 'Express' });
//});

// init gfs
const mongoURI = "mongodb://localhost:27017/vr_images";

// connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images"
  });
});

// ############### 화면에 link, entity 가져오기 ###############
router.get('/:vid', function (req, res) {
  VRItem.findOne({ _id: req.params.vid }, function (err, vritem) {
    if (err) return res.status(500).json({ error: err });
    if (!vritem) return res.status(404).json({ error: 'vritem not found' });

    var linkList;
    var entityList;
    var sceneName;
    var sceneId;
    var regionId;
    var sceneName;

    if (!vritem.links) {
      linkList = {
        left: { name: vritem.left_name, x: -6, y: 1.5, z: 0, yaw: 0, pitch: 90, roll: 0 },
        up: { name: vritem.up_name, x: 0, y: 1.5, z: 6, yaw: 0, pitch: 0, roll: 0 },
        right: { name: vritem.right_name, x: 6, y: 1.5, z: 0, yaw: 0, pitch: -90, roll: 0 },
        down: { name: vritem.down_name, x: 0, y: 1.5, z: -6, yaw: 0, pitch: 0, roll: 0 }
      }
    }
    //{left:{vritem.left_name, up:vritem.up_name, right:vritem.right_name, down:vritem.down_name};
    else {
      linkList = vritem.links;
    }

    // console.log('###### linkList');
    // console.log(linkList);
    // console.log(circleList[0]);
    //console.log(circleList);
    // console.log(entit\yList.length);

    // boxtest는 entityList로 가져옴
    entityList = vritem.boxtest;

    // console.log('===================================');
    // console.log(`${vritem.region_id} ///// ${vritem.scene_name}`);
    // console.log(entityList);

    // console.log(req.params.vid)      // 현재 vr_id
    // console.log(vritem.region_id)    // 현재 region_id

    VRModel.find({ region_id: vritem.region_id }, function (err, vrmodels) {
      sceneName = vrmodels.scene_name;  // scene 이름
      sceneId = vrmodels._id;          // scene id

      var sceneName = [];
      var sceneId = [];

      for (i in vrmodels) {
        sceneName.push(vrmodels[i]['scene_name']);
        sceneId.push(vrmodels[i]['_id']);
        // console.log(vrmodels[i]['scene_name']);
        // console.log(vrmodels[i]['_id']);
      }

      console.log(sceneName);
      console.log(sceneId);

      return res.render("vr_item", { vid: req.params.vid, vrimage_id: vritem.image_file, arrowList: linkList, objectList: entityList, sceneName: sceneName, sceneId: sceneId });
    });

    // linkList, objectList render하기
  });
});

router.get('/scene/:scene_name', function (req, res) {
  VRItem.findOne({ scene_name: req.params.scene_name }, function (err, vritem) {
    if (err) return res.status(500).json({ error: err });
    if (!vritem) return res.status(404).json({ error: 'vritem not found' });

    //var linkList = {left:vritem.left_name, up:vritem.up_name, right:vritem.right_name, down:vritem.down_name};
    //console.log(linkList);
    return res.redirect("/vr/" + vritem._id);
    //return res.render("vr_item", { vrimage_id: vritem.image_file, arrowList:linkList });
  })
});

router.get("/image/:image_id", (req, res) => {
  //console.log('id', req.params.id)
  const obj_id = new mongoose.Types.ObjectId(req.params.image_id);
  const file = gfs
    .find(obj_id)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }

      gfs.openDownloadStream(obj_id).pipe(res);
    });
});

router.put("/scene_update/:id", (req, res) => {
  VRItem.findOne({ _id: req.params.id }, function (err, item) {

    if ("left" in req.body) {
      item.links.left.x = req.body.left[0]['x'];
      item.links.left.y = req.body.left[0]['y'];
      item.links.left.z = req.body.left[0]['z'];

      item.links.left.yaw = req.body.left[1]['x'];
      item.links.left.pitch = req.body.left[1]['y'];
      item.links.left.roll = req.body.left[1]['z'];
    }

    if ("right" in req.body) {
      item.links.right.x = req.body.right[0]['x'];
      item.links.right.y = req.body.right[0]['y'];
      item.links.right.z = req.body.right[0]['z'];

      item.links.right.yaw = req.body.right[1]['x'];
      item.links.right.pitch = req.body.right[1]['y'];
      item.links.right.roll = req.body.right[1]['z'];
    }

    if ("up" in req.body) {
      item.links.up.x = req.body.up[0]['x'];
      item.links.up.y = req.body.up[0]['y'];
      item.links.up.z = req.body.up[0]['z'];

      item.links.up.yaw = req.body.up[1]['x'];
      item.links.up.pitch = req.body.up[1]['y'];
      item.links.up.roll = req.body.up[1]['z'];
    }

    if ("down" in req.body) {
      item.links.down.x = req.body.down[0]['x'];
      item.links.down.y = req.body.down[0]['y'];
      item.links.down.z = req.body.down[0]['z'];

      item.links.down.yaw = req.body.down[1]['x'];
      item.links.down.pitch = req.body.down[1]['y'];
      item.links.down.roll = req.body.down[1]['z'];
    }

    // ############### DB에 entity 저장하기 ##############
    if ("boxtest" in req.body) {
      // boxtest에 이미 저장된 요소들 undefined가 될 때까지 비우기
      while (item.boxtest.shift() !== undefined)

        console.log('boxtest try save');
      // console.log('length' + String(req.body.boxtest.length));

      // boxtest value에 entity 하나씩 push하기
      for (let i = 0; i < (req.body.boxtest.length); i++) {
        item.boxtest.push({
          x: req.body.boxtest[i][0]['x'], // position
          y: req.body.boxtest[i][0]['y'],
          z: req.body.boxtest[i][0]['z'],
          yaw: req.body.boxtest[i][1]['x'], // rotation
          pitch: req.body.boxtest[i][1]['y'],
          roll: req.body.boxtest[i][1]['z'],
          xscale: req.body.boxtest[i][2]['x'], //scale
          yscale: req.body.boxtest[i][2]['y'],
          zscale: req.body.boxtest[i][2]['z'],
          id: req.body.boxtest[i][3], // id
          loc: req.body.boxtest[i][4],  // loc
          geometry: req.body.boxtest[i][5],  // material
          color: req.body.boxtest[i][6] // color
        });
      }
      console.log('boxtest finish save');
    }

    // ############### Save single-object ###############
    // if("boxtest" in req.body)
    // {
    //   item.boxtest.pos.x = req.body.boxtest[0]['x']; //position
    //   item.boxtest.pos.y = req.body.boxtest[0]['y'];
    //   item.boxtest.pos.z = req.body.boxtest[0]['z'];

    //   item.boxtest.pos.yaw   = req.body.boxtest[1]['x']; //rotation
    //   item.boxtest.pos.pitch = req.body.boxtest[1]['y'];
    //   item.boxtest.pos.roll  = req.body.boxtest[1]['z'];

    //   item.boxtest.pos.id = req.body.boxtest[2]; //id
    //   item.boxtest.pos.loc = req.body.boxtest[3]; //loc
    //   item.boxtest.pos.mixin = req.body.boxtest[4]; //mixin
    //   item.boxtest.pos.color = req.body.boxtest[5]; //color
    // }

    item.save(function (err) {
      if (err) {
        console.error(err);
        res.send(err);
        return;
      }
    });
  });



  return res.send('updated');
});

module.exports = router;