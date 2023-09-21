const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({ path: '.env' })

//cors permiten que  un cliente se conecta  a otro servidor para el intercambio de recursos
const cors = require('cors')

//conectar mongo
const dbURL = process.env.DB_URL;
mongoose.Promise = global.Promise;
mongoose.connect(dbURL, {
  useNewUrlParser: true,
});

// Manejar eventos de conexión
const db = mongoose.connection;

// Evento de conexión exitosa
db.on('connected', () => {
  console.log(`Conexión a MongoDB establecida en ${dbURL}`);
});

// Evento de error en la conexión
db.on('error', (err) => {
  console.error(`Error de conexión a MongoDB: ${err}`);
});

// Evento de desconexión
db.on('disconnected', () => {
  console.warn('Conexión a MongoDB desconectada');
});

// Manejar cierre de la aplicación
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
    process.exit(0);
  });
});

//crear el servidor
const app = express()

//habilitar body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//definir dominio(s) para recibir las peticiones
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
  origin: (origin, callback) => {
    console.log({ origin })
    const existe = whitelist.some(dominio => dominio === origin)
    if (existe) {
      callback(null, true)
    } else {
      callback(new Error('No permiido por CORS'))
    }
  }
}

//hanilitar cors
app.use(cors())

//rutas de la app
app.use('/', routes())

//caperta publica
app.use(express.static('uploads'))

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5001

// iniciar app
app.listen(port, host, ()=>{

})

