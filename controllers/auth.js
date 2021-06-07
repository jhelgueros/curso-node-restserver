const { request, response } = require('express')
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')
const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si correo exiete
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Usuario activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            })
        }


        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - pass'
            })
        }


        //Generar JWT
        const token = await generarJWT(usuario.id)



        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Hable con el administrador X"
        })
    }


}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;
    //console.log(id_token)

    try {
        const { correo, nombre, img } = await googleVerify(id_token)


        let usuario = await Usuario.findOne({ correo })
        console.log(usuario)

        if (!usuario) {
            //Crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        //Si el usuario esta false
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }


        const token = await generarJWT(usuario.id)


        //console.log(googleUser)
        res.json({
            usuario,
            token

        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es reconocido'
        })
    }

}

module.exports = {

    login,
    googleSignIn

}