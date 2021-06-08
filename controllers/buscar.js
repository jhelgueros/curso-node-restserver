const { response } = require("express");
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
    'porcategoria'
]

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    //.count para contar registros 

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]

    })

    res.json(
        {
            results: usuarios
        })
}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    //.count para contar registros 

    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre')
    res.json(
        {
            results: productos
        })
}

const buscarProductosPorCategoria = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if (esMongoID) {
        const producto = await Producto.find({ categoria: termino })
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    } else {
        return res.json({
            results: []
        })
    }
}



const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    //.count para contar registros 

    const categorias = await Categoria.find({ nombre: regex, estado: true })

    res.json(
        {
            results: categorias
        })
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas de busqueda son ${coleccionesPermitidas}`
        })

    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'porcategoria':
            buscarProductosPorCategoria(termino, res)
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer la busqueda por rol'
            })
    }
}

module.exports = {
    buscar
}