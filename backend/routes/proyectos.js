
var express = require('express');
var router = express.Router();
var proyectoC = require('../controllers/proyectoC')
const upload = require('../utils/upload')
const protegerRuta = require('../middlewares/auth')

router.get('/', protegerRuta, function (req, res, next) {
  proyectoC.todos()
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.get('/uno', protegerRuta, function (req, res, next) {
  proyectoC.uno(req.body.id_pro)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/filtros', protegerRuta, function (req, res, next) {
  proyectoC.filtros(req.body.estado)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/crear', protegerRuta, upload.fields([
  { name: 'imagen', protegerRuta, maxCount: 1 },
  { name: 'documento', protegerRuta, maxCount: 1 }
]), function (req, res, next) {
  proyectoC.crear(req.body, req.files)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/editar', protegerRuta, upload.fields([
  { name: 'imagen', protegerRuta, maxCount: 1 },
  { name: 'documento', protegerRuta, maxCount: 1 }
]), function (req, res, next) {
  proyectoC.editar(req.body, req.files)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/estado', protegerRuta, function (req, res, next) {
  proyectoC.cambiarEstado(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/lider', protegerRuta, function (req, res, next) {
  proyectoC.cambiarLider(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/cambiarEquipo', protegerRuta, function (req, res, next) {
  proyectoC.cambiarEquipo(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/fechas', protegerRuta, function (req, res, next) {
  proyectoC.cambiarFechas(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminar', protegerRuta, function (req, res, next) {
  proyectoC.eliminar(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
