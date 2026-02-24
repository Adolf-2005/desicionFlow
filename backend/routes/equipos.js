var express = require('express');
var router = express.Router();
var equiposC = require('../controllers/equiposC')
const protegerRuta = require('../middlewares/auth')
/* GET users listing. */
router.get('/miembros', protegerRuta, function (req, res, next) {
  equiposC.miembros()
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.get('/', protegerRuta, function (req, res, next) {
  equiposC.equipos()
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/crear', protegerRuta, function (req, res, next) {
  equiposC.crear(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/editar', protegerRuta, function (req, res, next) {
  equiposC.editar(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminar', protegerRuta, function (req, res, next) {
  equiposC.eliminar(req.body.id_equi)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminar/miembro', protegerRuta, function (req, res, next) {
  equiposC.elimiarMiembro(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
