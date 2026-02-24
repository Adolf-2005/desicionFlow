var express = require('express');
var router = express.Router();
const protegerRuta = require('../middlewares/auth')

/* GET home page. */
router.get('/',protegerRuta, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
