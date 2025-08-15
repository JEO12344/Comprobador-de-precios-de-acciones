'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

// Configuración de Helmet con CSP específico
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Solo recursos desde tu servidor
        scriptSrc: ["'self'"],  // Solo scripts desde tu servidor
        styleSrc: ["'self'"],   // Solo CSS desde tu servidor
        imgSrc: ["'self'"],     // Solo imágenes desde tu servidor
        fontSrc: ["'self'"],    // Solo fuentes desde tu servidor
        objectSrc: ["'none'"],  // Bloquea plugins (ej: Flash)
        mediaSrc: ["'self'"],   // Solo medios desde tu servidor
        frameSrc: ["'none'"],   // Bloquea iframes
        connectSrc: ["'self'", "https://stock-price-checker-proxy.freecodecamp.rocks"] // Permite conexión al proxy de FCC
      }
    },
    noSniff: true,          // Evita MIME-type sniffing
    xssFilter: true         // Filtro XSS
  })
);

// Middleware para cabeceras de caché
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Servir archivos estáticos
app.use('/public', express.static(process.cwd() + '/public'));

// Configuración de CORS (para pruebas)
app.use(cors({ origin: '*' }));

// Parsers para requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

fccTestingRoutes(app);
apiRoutes(app);

// Manejo de 404
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app;