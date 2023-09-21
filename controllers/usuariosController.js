const Usuarios = require('../models/Usuarios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.registrarUsuario = async (req, res) => {
    //leer los datos de l usuario y colocarlos en Usuarios
    const usuario = new Usuarios(req.body)
    usuario.password = await bcrypt.hash(req.body.password, 12)
    try {
        await usuario.save()
        res.json({ mensaje: 'Usuario Creado Correctamente' })
    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'Hubo un error, posiblemente el usuario ya se encuentra registrado' })
    }

}

exports.autenticarUsuario = async (req, res, next) => {

    //buscar el usuario
    const { email, password } = req.body
    const usuario = await Usuarios.findOne({ email })

    if (!usuario) {
        //si el usuario no existe
        await res.status(401).json({ mensaje: 'Crendenciales Erradas, verifica por favor' })
        next()
    } else {
        //si el usuario existe, comprobar el password
        if (!bcrypt.compareSync(password, usuario.password)) {
            await res.status(401).json({ mensaje: 'Crendenciales Erradas, verifica por favor' })
            next()
        } else {
            const token = jwt.sign({
                email: usuario.email,
                nombre: usuario.nombre,
                id: usuario._id
            },
                'LLAVESECRETA',
                {
                    expiresIn: '1h'
                })
            return res.json({ token,  mensaje: 'Bienvenido'  })
    }

}

}