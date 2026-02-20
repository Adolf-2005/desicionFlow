var express = require('express');
var router = express.Router();
var usuariosC = require('../controllers/usuariosC')

/* GET home page. */
router.get('/', function(req, res, next) {
  usuariosC.todos()
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.post('/crear', function(req, res, next) {
  usuariosC.crear(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.post('/login', function(req, res, next) {
  usuariosC.login(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.post('/cambio', function(req, res, next) {
  usuariosC.cambioClave(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.put('/editar', function(req, res, next) {
  usuariosC.editar(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.delete('/eliminar', function(req, res, next) {
  usuariosC.eliminar(req.body.id_usu)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

module.exports = router;
