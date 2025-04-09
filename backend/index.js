const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Inicializamos la aplicación Express
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); 
// ↑ express.json() para recibir JSON en el body de las peticiones 
// y limit más alto por si envías imágenes en base64.


// Configurar conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',   // Cambia según tu configuración
  user: 'root',        // Cambia según tu configuración
  password: '$191591Jor',   // Cambia según tu configuración
  database: 'asistencia_unmsm', // Cambia según tu BD
});

db.connect(function(err) {
  if (err) {
    console.error('Error de conexión a MySQL:',  err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL' + db.threadId);
});

// const conector = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '$191591Jor',
//     database: 'asistencia_unmsm',
// })

// conector.connect(function (err) {
//     if (err) {
//         console.error('Error de conexion: ' + err.stack);
//         return;
//     }
//     console.log('Conectado a la base de datos con el identificador ' + conector.threadId);
// });


// Ruta de prueba (opcional)
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Ruta para registrar asistencia
app.post('/api/asistencia', (req, res) => {
  const { dni, imagen } = req.body;
  // Aquí puedes hacer tu lógica para determinar ingreso o salida,
  // verificar si el DNI existe, etc.

  // Ejemplo básico: insertar un registro en la tabla "asistencia"
  const fechaHora = new Date(); // Marca de tiempo

  // Prepara la consulta
  const sql = `INSERT INTO asistencia (dni, fecha_hora, imagen) VALUES (?, ?, ?)`;

  // Ejecuta la consulta
  db.query(sql, [dni, fechaHora, imagen], (err, result) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).json({ message: 'Error al registrar asistencia' });
    }
    // Envía una respuesta con éxito
    return res.json({ message: 'Asistencia registrada exitosamente' });
  });
});

// Ponemos el servidor a escuchar
const PORT = 9000; // o el que prefieras
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
