const Productos = require('../models/Productos')

const multer = require('multer')
const shortid = require('shortid')

const configMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error('formato no valido'))
        }
    },
}

//pasar la config y el campo
const upload = multer(configMulter).single('imagen')

//subir un archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: 'Hubo un error al subir la imagen' })
        }
        return next()
    })
}

exports.nuevoProducto = async (req, res, next) => {

    const producto = new Productos(req.body)
    try {
        if (req.file.filename) {
            producto.imagen = req.file.filename
        }
        await producto.save()
        res.json({ mensaje: 'Producto creado con exito' })

    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarProductos = async (req, res, next) => {
    try {
        const productos = await Productos.find({})
        res.json(productos)
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarProductosByID = async (req, res, next) => {


    try {
        const producto = await Productos.findById(req.params.productoId)

        if (!producto) {
            res.json('Producto no encontrado')
            next()
        }

        res.json(producto)

    } catch (error) {
        console.error('Error al buscar el cliente por ID:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

}

exports.actualizarProductos = async (req, res, next) => {
    try {

        let nuevoProducto = req.body

        if (req.file) {
            nuevoProducto.imagen = req.file.filename
        } else {
            let productoAnt = await Productos.findById(req.params.productoId)
            nuevoProducto.imagen = productoAnt.imagen
        }


        let producto = await Productos.findOneAndUpdate({ _id: req.params.productoId }, nuevoProducto, {
            new: true
        })

        res.json({ mensaje: 'Producto Actualizado Correctamente', producto })

    } catch (error) {
        console.log(error)
        next()
    }
}

exports.eliminarProducto = async (req, res, next) => {
    try {
        await Productos.findOneAndDelete({ _id: req.params.productoId })
        res.json({ mensaje: 'Producto eliminado' })
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.buscarProducto = async (req, res, next) => {
    try {
        //obtener el producto
        const { query } = req.params;
        const productos = await Productos.find({ nombre: { $regex: new RegExp(query, 'i') } });
        res.json(productos);
    } catch (error) {
        console.log(error)
        res.json({mensaje : 'No se encontró ningún resultado en la busqueda'});
        next()
    }
}