var express = require('express');
var router = express.Router();
var Region = require('../models/regionModel');

/* GET home page. */
router.get('/', function (req, res) {
    Region.find(function (err, regions) {
        if (err) {
            return res.status(500).send({error: 'database failure'});
        }
        //console.log('get vill')
        res.render('index', {regionList: regions, title: 'VR Web Viewer'});
    });
});

module.exports = router;
