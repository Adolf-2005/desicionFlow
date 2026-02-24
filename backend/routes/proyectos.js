
var express = require('express');
var router = express.Router();
var proyectoC = require('../controllers/proyectoC')
const upload = require('../utils/upload')

router.get('/', function (req, res, next) {
  proyectoC.todos()
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/filtros', function (req, res, next) {
  proyectoC.filtros(req.body.estado)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/crear', upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'documento', maxCount: 1 }
]), function (req, res, next) {
  proyectoC.crear(req.body, req.files)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.post('/editar', upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'documento', maxCount: 1 }
]), function (req, res, next) {
  proyectoC.editar(req.body, req.files)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/estado', function (req, res, next) {
  proyectoC.cambiarEstado(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/lider', function (req, res, next) {
  proyectoC.cambiarLider(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/cambiarEquipo', function (req, res, next) {
  proyectoC.cambiarEquipo(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.put('/fechas', function (req, res, next) {
  proyectoC.cambiarFechas(req.body)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

router.delete('/eliminar', function (req, res, next) {
  proyectoC.eliminar(req.body.id_pro)
    .then((result) => {
      res.status(result.status).json(result)
    }).catch((err) => {
      res.status(err.status).json(err)
    });
});

module.exports = router;
