var express = require('express');
var router = express.Router();
var RegionModel = require('../models/regionModel');
var VRItem = require('../models/vrModel');
const upload = require("../models/upload");
var connectionModel = require('../models/connectModel')

router.get('/', function (req, res) {
    RegionModel.aggregate([{
            $lookup: {
                from: "vritems", // collection to join
                localField: "_id",//field from the input documents
                foreignField: "region_id",//field from the documents of the "from" collection
                as: "vrList"// output array field
            }
        }], function (err, data) {
        if (err) return res.status(500).send({ error: 'database failure' });
        res.render('region-list-view', { regionList: data});
        
    });
});

router.get('/new', function (req, res) {
    res.render('region-add',);
});

router.post('/new', function (req, res) {
    var region = new RegionModel();
    var body = req.body;
    region.name = body.regionName;
    region.location = body.regionLocation;
    region.save(function (err) {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
    });
    res.redirect('/admin/regions');
});

router.post('/add_item', async (req, res) => {
    try 
    {
        await upload(req, res);
        // if (req.file == undefined) {
        //     return res.send(`You must select a file.`);
        // }

        var vritem = new VRItem();
        var body = req.body;

        // if (!req.file)
        //     return res.status(400).send('No files were uploaded.');

        vritem.region_id = new mongoose.Types.ObjectId(body.vrid);
        vritem.scene_name = body.SceneName;
        if(req.file) vritem.image_file = req.file.id;
        vritem.links = {left:{name:body.leftPos, x:-6, y:1.5, z:0, yaw:0, pitch:90, roll:0},
                        up:{name:body.upPos, x:0, y:1.5, z:6, yaw:0, pitch:0, roll:0},
                        right:{name:body.rightPos, x:6, y:1.5, z:0, yaw:0, pitch:-90, roll:0},
                        down:{name:body.downPos, x:0, y:1.5, z:-6, yaw:0, pitch:0, roll:0}
                        } 

        vritem.save(function (err) {
            if (err) {
                console.error(err);
                res.send(err);
                return;
            }
        });

        res.redirect('/admin/regions');
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
});

var mongoose = require('mongoose');
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

router.delete('/delete/:id', function (req, res) {
    
    VRItem.find({'region_id': req.params.id}, function (err, vritem) {
        if (err) return res.status(500).json({ error: err });
        if (vritem)
        {
            for(var item of vritem)
            {
                const obj_id = new mongoose.Types.ObjectId(item.image_file);
                gfs.delete(obj_id);
            }
        }
    });

    RegionModel.deleteOne({ _id:req.params.id }, function (err, output) {
        if(err) return res.status(500).json({ error: "database failure" });
    })

    VRItem.deleteMany({ region_id:req.params.id }, function (err, output) {
        if(err) return res.status(500).json({ error: "database failure" });

    });
    
    res.redirect(303,'/admin/regions/');
});

router.delete('/vrscene_del/:id', function (req, res) {
    
    console.log(req.params.id)
    VRItem.find({'_id': req.params.id}, function (err, vritem) {
        if (err) return res.status(500).json({ error: err });
        if (vritem)
        {
            for(var item of vritem)
            {
                const obj_id = new mongoose.Types.ObjectId(item.image_file);
                gfs.delete(obj_id);
            }
        }
    });

    VRItem.deleteMany({ _id:req.params.id }, function (err, output) {
        if(err) return res.status(500).json({ error: "database failure" });

    });
    
    res.redirect(303,'/admin/regions/');
});

router.get('/add_vr/:id', function (req, res) {
    res.render('vr-add', {region_id:req.params.id});
});

/*
Update VRitems
*/
router.get('/update_vr/:id', async (req, res) => {
    VRItem.findOne({'_id': new mongoose.Types.ObjectId(req.params.id)}, function (err, vritem) {
        if (err) return res.status(500).json({ error: err });
        if (vritem)
        {
            res.render('vr_update', {vrItem:vritem});     
        }
        else
            return res.status(404).json({ error: 'VR Item not found' });
    });
});

router.post('/update_vr', function (req, res) {
    //var body = req.body;
    VRItem.findOne({_id:req.body.SceneID}, function(error, vritem){
        vritem.links.left.name    = req.body.leftPos;
        vritem.links.up.name      = req.body.upPos;
        vritem.links.right.name   = req.body.rightPos;
        vritem.links.down.name    = req.body.downPos;
        
        vritem.save(function (err) {
            if (err) {
                console.error(err);
                res.send(err);
                return;
            }
        });
    });
    res.redirect('/admin/regions');
});

module.exports = router;
