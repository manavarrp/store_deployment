const Pedidos = require('../models/Pedidos')

exports.nuevoPedido = async (req, res, next) => {

    const pedido = new Pedidos(req.body)
    try {
        await pedido.save()
        res.json({ mensaje: 'pedido creado con exito' })

    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        })
        res.json(pedidos)
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarPedidosByID = async (req, res, next) => {

    try {
        const pedidos = await Pedidos.findById(req.params.pedidoId).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });

        if (!pedidos) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        // Mostrar el cliente
        res.json(pedidos);
    } catch (error) {
        console.error('Error al buscar el cliente por ID:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

}

exports.actualizarPedido = async (req, res, next) => {
    try {
        const pedidos = await Pedidos.findOneAndUpdate({_id: req.params.pedidoId}, req.body, {
            new: true
        }).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        })

        res.json({ mensaje: 'pedido actualizado', pedidos})
        
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.eliminarPedido = async (req, res, next) => {
    try {
        await Pedidos.findOneAndDelete({ _id:req.params.pedidoId })
        res.json({ mensaje: 'pedido eliminado con exito'})
    } catch (error) {
        console.log(error)
        next()
    }
}