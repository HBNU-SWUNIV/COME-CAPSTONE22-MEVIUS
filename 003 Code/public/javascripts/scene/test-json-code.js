var mongoose = require('mongoose');
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

VRItem.find({'region_id': req.params.id}, function (err, vritem) {
    if (err) return res.status(500).json({ error: err });
    if (vritem)
    {
        console.log(vritem);
        // for(var item of vritem)
        // {
        //     const obj_id = new mongoose.Types.ObjectId(item.image_file);
        //     gfs.delete(obj_id);
        // }
    }
});