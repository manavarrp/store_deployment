const Clientes = require('../models/Clientes')


//metodo para crear clientes
exports.nuevoCliente = async (req, res, next) => {
    const cliente = new Clientes(req.body)

    try {
        await cliente.save()
        res.json({ mensaje: 'Se agrego un nuevo cliente' })
    } catch (error) {
        res.status(409).json({mensaje: 'Existe un usuario con ese correo'})
        next()
    }

}


//metodo para mostrar los clientes
exports.mostrarClientes = async (req, res, next) => {
    try {
        const clientes = await Clientes.find({})
        res.json(clientes)
    } catch (error) {
        console.log(error)
        next()
    }
}


exports.mostrarClientesByID = async (req, res, next) => {
    
        const cliente = await Clientes.findById(req.params.clienteId);

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        // Mostrar el cliente
        res.json(cliente);
    
};


exports.actualizarCliente = async (req, res, next) => {
    try {
        const cliente = await Clientes.findOneAndUpdate({ _id: req.params.clienteId }, req.body, {
            new: true
        });

        // Mostrar el cliente
        res.json({
            mensaje: 'Cliente actualizado correctamente',
            cliente
        });
    } catch (error) {
        console.error(error);
        next()
    }
}


exports.eliminarCliente = async (req, res, next) => {
    try {
      await Clientes.findOneAndDelete({ _id: req.params.clienteId });

        // Mostrar el cliente
        res.json({
            mensaje: 'Cliente Eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        next()
    }
}
