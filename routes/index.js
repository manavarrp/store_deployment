const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/clienteController')
const productosController = require('../controllers/productosController')
const pedidosController = require('../controllers/pedidosController')
const usuariosController = require('../controllers/usuariosController')

const auth = require('../middleware/auth')

module.exports = function () {

    /** Clientes */

    router.post('/clientes', auth, clienteController.nuevoCliente)

    router.get('/clientes', auth, clienteController.mostrarClientes)

    router.get('/clientes/:clienteId',auth, clienteController.mostrarClientesByID)

    router.put('/clientes/:clienteId', clienteController.actualizarCliente)

    router.delete('/clientes/:clienteId',auth, clienteController.eliminarCliente)

    /**Productos */
    router.post('/productos',
        productosController.subirArchivo,
        productosController.nuevoProducto)

    router.get('/productos', auth, productosController.mostrarProductos)

    router.get('/productos/:productoId', auth, productosController.mostrarProductosByID)

    router.put('/productos/:productoId',
        productosController.subirArchivo,
        productosController.actualizarProductos)

    router.delete('/productos/:productoId',auth, productosController.eliminarProducto)

    router.post('/productos/buscar/:query',auth, productosController.buscarProducto)

      /**Pedidos */
      router.post('/pedidos',auth, pedidosController.nuevoPedido)

      router.get('/pedidos', pedidosController.mostrarPedidos)

      router.get('/pedidos/:pedidoId',auth, pedidosController.mostrarPedidosByID)

      router.put('/pedidos/:pedidoId',auth, pedidosController.actualizarPedido)

      router.delete('/pedidos/:pedidoId',auth, pedidosController.eliminarPedido)

      /**Usuarios */
      router.post('/crear-cuenta',auth, usuariosController.registrarUsuario)

      router.post('/iniciar-sesion', usuariosController.autenticarUsuario)

    return router
}