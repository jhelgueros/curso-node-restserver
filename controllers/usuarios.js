const { request, response } = require('express')


const usuariosGet = (req = request, res = response) => {

    const { q, nombre, apikey, page = 1, limit } = req.query

    res.json({
        "msg": "get API - Controlador",
        q,
        nombre,
        apikey,
        page,
        limit
    })
}

const usuariosPut = (req = request, res = response) => {

    const { id } = req.params

    res.json({
        "msg": "put API",
        id
    })
}

const usuariosPost = (req = request, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        "msg": "post API",
        nombre,
        edad
    })
}


const usuariosDelete = (req = request, res = response) => {
    res.json({
        "msg": "delete API"
    })
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}