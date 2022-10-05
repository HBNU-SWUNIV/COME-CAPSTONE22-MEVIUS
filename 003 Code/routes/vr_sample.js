var express = require('express');
var router = express.Router();
var VRItem = require('../models/vrModel');
var Connections = require('../models/connectModel')
var mongoose = require('mongoose');

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


router.get('/:vid', function(req, res) {
    VRItem.findOne({_id: req.params.vid}, function (err, vritem) {
        if (err) return res.status(500).json({ error: err });
        if (!vritem) return res.status(404).json({ error: 'vritem not found' });

        
        if(!vritem.links)
        {
          var linkList = {left: {name:vritem.left_name, x:-6, y:1.5, z:0, yaw:0, pitch:90, roll:0},
                          up:   {name:vritem.up_name, x:0, y:1.5, z:6, yaw:0, pitch:0, roll:0},
                          right:{name:vritem.right_name, x:6, y:1.5, z:0, yaw:0, pitch:-90, roll:0},
                          down: {name:vritem.down_name, x:0, y:1.5, z:-6, yaw:0, pitch:0, roll:0}} 
        }  
        //{left:{vritem.left_name, up:vritem.up_name, right:vritem.right_name, down:vritem.down_name};
        else
        {
          var linkList = vritem.links;
        }

        var boxList = vritem.boxtest;

        console.log(linkList);
        console.log(boxList);
        return res.render("vr_item", { vid:req.params.vid, vrimage_id: vritem.image_file, arrowList:linkList, objectList:boxList });
    })
});

router.get('/scene/:scene_name', function(req, res) {
    VRItem.findOne({scene_name: req.params.scene_name}, function (err, vritem) {
        if (err) return res.status(500).json({ error: err });
        if (!vritem) return res.status(404).json({ error: 'vritem not found' });

        //if 
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

router.put("/scene_update/:id", (req, res)=>{

  VRItem.findOne({_id: req.params.id}, function (err, item) {
    
    if("left" in req.body)
    {
      console.log('left');
      item.links.left.x = req.body.left[0]['x'];
      item.links.left.y = req.body.left[0]['y'];
      item.links.left.z = req.body.left[0]['z'];

      item.links.left.yaw   = req.body.left[1]['x'];
      item.links.left.pitch = req.body.left[1]['y'];
      item.links.left.roll  = req.body.left[1]['z'];
    }

    if("right" in req.body)
    {
      item.links.right.x = req.body.right[0]['x'];
      item.links.right.y = req.body.right[0]['y'];
      item.links.right.z = req.body.right[0]['z'];

      item.links.right.yaw   = req.body.right[1]['x'];
      item.links.right.pitch = req.body.right[1]['y'];
      item.links.right.roll  = req.body.right[1]['z'];
    }

    if("up" in req.body)
    {
      item.links.up.x = req.body.up[0]['x'];
      item.links.up.y = req.body.up[0]['y'];
      item.links.up.z = req.body.up[0]['z'];

      item.links.up.yaw   = req.body.up[1]['x'];
      item.links.up.pitch = req.body.up[1]['y'];
      item.links.up.roll  = req.body.up[1]['z'];
    }

    if("down" in req.body)
    {
      item.links.down.x = req.body.down[0]['x'];
      item.links.down.y = req.body.down[0]['y'];
      item.links.down.z = req.body.down[0]['z'];

      item.links.down.yaw   = req.body.down[1]['x'];
      item.links.down.pitch = req.body.down[1]['y'];
      item.links.down.roll  = req.body.down[1]['z'];
    }      

    // 추가
    if("boxtest" in req.body)
    {
      console.log("boxtest");
      item.boxtest.pos.x = req.body.boxtest[0]['x'];
      item.boxtest.pos.y = req.body.boxtest[0]['y'];
      item.boxtest.pos.z = req.body.boxtest[0]['z'];

      item.boxtest.pos.yaw   = req.body.boxtest[1]['x'];
      item.boxtest.pos.pitch = req.body.boxtest[1]['y'];
      item.boxtest.pos.roll  = req.body.boxtest[1]['z'];
    }
  
    item.save(function (err) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
    });
  });
  
  
  
  return res.send('updated done');
});

module.exports = router;