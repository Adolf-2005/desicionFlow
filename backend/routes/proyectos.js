
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

router.put('/editar', upload.fields([
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

module.exports = router;
