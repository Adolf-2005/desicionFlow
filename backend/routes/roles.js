var express = require('express');
var router = express.Router();
var rolesC = require('../controllers/rolesC')

/* GET users listing. */
router.get('/', function (req, res, next) {
  rolesC.roles()
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/crear', function (req, res, next) {
  rolesC.crear(req.body.nombre)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/editar', function (req, res, next) {
  rolesC.editar(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
