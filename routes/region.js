var express = require('express');
var router = express.Router();
var Region = require('../models/regionModel');
var VRModel = require('../models/vrModel')


router.get('/:id', function (req, res) {
    Region.findOne({ _id: req.params.id }, function (err, region) {
        if (err) return res.status(500).json({ error: err });
        if (!region) return res.status(404).json({ error: 'region not found' });

        VRModel.find({ region_id: req.params.id }, function (err, vrmodels) {
            if (err) return res.status(500).json({ error: err });
            if (!vrmodels) res.render('region-view', { region: region, vrList: [] });

            // console.log(vrmodels[0]['region_id']);

            res.render('region-view', { region: region, vrList: vrmodels });
        });

    });
});

module.exports = router;