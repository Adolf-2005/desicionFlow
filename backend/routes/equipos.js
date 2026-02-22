var express = require('express');
var router = express.Router();
var equiposC = require('../controllers/equiposC')

/* GET users listing. */
router.get('/miembros', function(req, res, next) {
  equiposC.miembros()
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.get('/', function(req, res, next) {
  equiposC.equipos()
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.post('/crear', function(req, res, next) {
  equiposC.crear(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

module.exports = router;
