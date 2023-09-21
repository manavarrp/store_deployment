const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    // aurtorización por el header
    const authHeader = req.get('Authorization')

    if (!authHeader) {
        const error = new Error('No autenticado, no puedes acceder a esta vista')
        error.statusCode = 401
        throw error
    }

    //obtener token
    const token = authHeader.split(' ')[1]
    let readToken
    try {
        readToken = jwt.verify(token, 'LLAVESECRETA')
    } catch (error) {
        error.statusCode = 500
        throw error
    }

    //sI ES UN TOKEN VALIDO, PERO HAY ALGUN ERROR
    if (!readToken) {
        const error = new Error('No autenticado')
        error.statusCode = 401
        throw error
    }

    next()
}