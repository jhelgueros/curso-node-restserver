const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'

        // Conectar a BD
        this.conectarDB()
        //Middlewares
        this.middlewares()
        //Rutaas de apps
        this.routes()
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        //CORS
        this.app.use(cors())

        //Parseo y lectura
        this.app.use(express.json())

        //Directorio publico
        this.app.use(express.static('public'))

    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios'))
        this.app.use(this.authPath, require('../routes/auth'))

    }


    listen() {

        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port)
        })
    }

}

module.exports = Server