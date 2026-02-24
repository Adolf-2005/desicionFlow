const jwt = require('jsonwebtoken');
require('dotenv').config()

const protegerRuta = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ mensaje: "Acceso denegado. No hay token." });
    }

    try {
        const verificado = jwt.verify(token, process.env.JSONWEBTOKEN);
        req.user = verificado; // Guardamos los datos del usuario en la petición
        next(); // Continuamos a la ruta
    } catch (error) {
        res.status(401).json({ mensaje: "Token no válido" });
    }
};

module.exports = protegerRuta;