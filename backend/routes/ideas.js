var express = require('express');
var router = express.Router();
const protegerRuta = require('../middlewares/auth')
const ideasC = require('../controllers/ideasC')
const comentariosC = require('../controllers/comentariosC')

/* GET home page. */
router.post('/crear', protegerRuta, function (req, res, next) {
  ideasC.crear(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/crearComentario', protegerRuta, function (req, res, next) {
  comentariosC.crearComentarioIdea(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/editar', protegerRuta, function (req, res, next) {
  ideasC.editar(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminar', protegerRuta, function (req, res, next) {
  ideasC.eliminar(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminarComentario', protegerRuta, function (req, res, next) {
  comentariosC.eliminarComIdea(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/cambiarEstado', protegerRuta, function (req, res, next) {
  ideasC.cambiarEstado(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
