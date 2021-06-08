const { response } = require("express");
const { Producto } = require('../models');

const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body

    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre })

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    //Generar data a grabar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data)

    //Guarda DB
    await producto.save()

    res.status(201).json(producto)

}

//ontenerCategorias - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}


// obtenerCategorias - populate

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

    res.json(producto)

}

// actualziarCategoria
const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params
    const { estado, usuario, ...resto } = req.body;

    /// Validar contra BD el ID
    if (resto.nombre) {
        resto.nombre = resto.nombre.toUpperCase();
    }

    resto.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, resto, { new: true })

    res.json(producto)
}



const borrarProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}