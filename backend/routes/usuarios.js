var express = require('express');
var router = express.Router();
var usuariosC = require('../controllers/usuariosC')
const protegerRuta = require('../middlewares/auth')

/* GET home page. */
router.get('/', protegerRuta, function (req, res, next) {
  usuariosC.todos()
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/crear', protegerRuta, function (req, res, next) {
  usuariosC.crear(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/login', function (req, res, next) {
  usuariosC.login(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/cambio', protegerRuta, function (req, res, next) {
  usuariosC.cambioClave(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/editar', protegerRuta, function (req, res, next) {
  usuariosC.editar(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminar', protegerRuta, function (req, res, next) {
  usuariosC.eliminar(req.body.id_usu)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
