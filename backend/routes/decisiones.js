var express = require('express');
var router = express.Router();
const protegerRuta = require('../middlewares/auth')
const decisionesC = require('../controllers/decisionesC')
const comentariosC = require('../controllers/comentariosC')

/* GET home page. */
router.post('/crear',protegerRuta, function(req, res, next) {
  decisionesC.crear(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.post('/crearComentario',protegerRuta, function(req, res, next) {
  comentariosC.crearComentario(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.put('/editar',protegerRuta, function(req, res, next) {
  decisionesC.editar(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.delete('/eliminar',protegerRuta, function(req, res, next) {
  decisionesC.eliminar(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

router.put('/cambiarEstado',protegerRuta, function(req, res, next) {
  decisionesC.cambiarEstado(req.body)
  .then((result) => {
    res.status(result.status).json(result)
  }).catch((err) => {
    res.status(err.status).json(err)
  });
});

module.exports = router;
