const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const usuario = require('../models/usuario')
const Usuario = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })

    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid)

        //Validar existe usuario
        if (!usuario) {
            res.status(401).json({
                msg: 'Token no valido - Usuario no existe en BD'
            })
        }

        //Validar su esado
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Token no valido - Usuario false'
            })
        }

        req.usuario = usuario;
        next()

    } catch (error) {
        console.log(token)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


    next();
}

module.exports = {

    validarJWT
}