const { response } = require("express");
const { Categoria } = require('../models');

//ontenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}


// obtenerCategorias - populate

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria)

}


const crearCategoria = async (req, res = response) => {


    const nombre = req.body.nombre.toUpperCase();

    console.log('El nombre', nombre)

    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //Generar data a grabar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    //Guarda DB
    await categoria.save()

    res.status(201).json(categoria)



}

// actualziarCategoria
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params
    const { estado, usuario, ...resto } = req.body;

    /// Validar contra BD el ID
    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    // if (password) {
    //     const salt = bcryptjs.genSaltSync();
    //     resto.password = bcryptjs.hashSync(password, salt)
    // }

    const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true })

    res.json(categoria)
}



const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(categoria);
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}