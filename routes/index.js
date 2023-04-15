var express = require('express');
var router = express.Router();
var db = require('../models');
var Lottery=db.lottery
const { isAdmin } = require('../middlewares/isAdmin');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});





module.exports = router;
