var express = require('express');
var router = express.Router();
const protegerRuta = require('../middlewares/auth')

/* GET users listing. */
router.get('/',protegerRuta, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
