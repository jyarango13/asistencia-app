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
  database: 'sistema_asistencia', // Cambia según tu BD
});

db.connect(function (err) {
  if (err) {
    console.error('Error de conexión a MySQL:', err.stack);
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
  const fechaHora = new Date(); // Marca de tiempo del servidor
  const horaActual = fechaHora.getHours() + ':' + fechaHora.getMinutes(); // Hora actual en formato 'HH:mm'
  const fechaActual = fechaHora.toISOString().split('T')[0]; // Solo la fecha 'YYYY-MM-DD'

  // Consulta para verificar si el DNI existe en la base de datos
  const sql1 = `SELECT id, nombres,apellidos, rol_id FROM personas WHERE dni = ?`;

  // Ejecutar la consulta para verificar si el DNI existe
  db.query(sql1, [dni], (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ success: false, message: 'Error al verificar el DNI' });
    }

    // Si el DNI no existe, devolver un error
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Persona no encontrada con ese DNI' });
    }

    // Si el DNI existe, obtenemos el ID de la persona y su rol
    const personaId = result[0].id;
    const rolId = result[0].rol_id;

    // Consulta para obtener los horarios permitidos para el rol de la persona
    const sql2 = `SELECT hora_inicio, hora_fin FROM horarios_permitidos WHERE rol_id = ?`;

    db.query(sql2, [rolId], (err, horarioResult) => {
      if (err) {
        console.error('Error al consultar los horarios permitidos:', err);
        return res.status(500).json({ success: false, message: 'Error al verificar los horarios permitidos' });
      }

      // Si no se encuentran los horarios para el rol, devolver un error
      if (horarioResult.length === 0) {
        return res.status(404).json({ success: false, message: 'Horarios no definidos para el rol' });
      }

      // Obtener los horarios de entrada y salida
      const horaInicio = horarioResult[0].hora_inicio;  // Ejemplo: '08:00'
      const horaFin = horarioResult[0].hora_fin;        // Ejemplo: '18:00'

      // Convertir las horas de inicio y fin en formato comparable (HH:mm)
      const [horaInicioH, horaInicioM] = horaInicio.split(':').map(num => parseInt(num, 10));
      const [horaFinH, horaFinM] = horaFin.split(':').map(num => parseInt(num, 10));
      const [horaActualH, horaActualM] = horaActual.split(':').map(num => parseInt(num, 10));

      // Validar si la hora actual está dentro del rango permitido para el ingreso
      const horaInicioEnMinutos = horaInicioH * 60 + horaInicioM;
      const horaFinEnMinutos = horaFinH * 60 + horaFinM;
      const horaActualEnMinutos = horaActualH * 60 + horaActualM;

      let tipoAsistenciaId;

      // Determinar si la persona está registrando un ingreso o salida
      if (horaActualEnMinutos >= horaInicioEnMinutos && horaActualEnMinutos <= horaFinEnMinutos) {
        // Si la hora actual está dentro del rango de ingreso, registrar el ingreso
        tipoAsistenciaId = 'A001'; // A001 es para ingreso
      } else if (horaActualEnMinutos > horaFinEnMinutos) {
        // Si la hora actual está después de la hora de salida, registrar la salida
        tipoAsistenciaId = 'A002'; // A002 es para salida
      } else {
        // Si no está dentro de los rangos, retornar un error
        return res.status(400).json({ success: false, message: 'Fuera del horario permitido para tu rol' });
      }

      // Verificar si ya existe un registro de asistencia para esa persona en el mismo día
      console.log(fechaActual);
      const sql3 = `SELECT * FROM asistencias WHERE persona_id = ? AND DATE(fecha) = ? AND tipo_asistencia_id = ?`;
      console.log(sql3);
      db.query(sql3, [personaId, fechaActual, tipoAsistenciaId], (err, existingAsistencia) => {
        if (err) {
          console.error('Error al verificar la asistencia existente:', err);
          return res.status(500).json({ success: false, message: 'Error al verificar la asistencia previa' });
        }

        // Si ya existe un registro de ese tipo (ingreso o salida) en el mismo día, no permitir otro
        if (existingAsistencia.length > 0) {
          console.log(existingAsistencia.length + 'ya existe');
          return res.status(400).json({ success: false, message: 'Ya has registrado tu asistencia para hoy' });
        } else {
          // Prepara la consulta para insertar la asistencia
          const sql = `INSERT INTO asistencias (persona_id, fecha_hora,fecha, tipo_asistencia_id, evidencia_id) VALUES (?, ?,?, ?, ?)`;

          // Insertar el registro de asistencia
          db.query(sql, [personaId, fechaHora, fechaActual, tipoAsistenciaId, imagen], (err, result) => {
            if (err) {
              console.error('Error al insertar en la base de datos:', err);
              return res.status(500).json({ success: false, message: 'Error al registrar la asistencia 2000' });
            }

            // Enviar una respuesta con éxito
            return res.json({ success: true, message: 'Asistencia registrada exitosamente' });
          });
        }



      });
    });
  });
});




// Ponemos el servidor a escuchar
const PORT = 9000; // o el que prefieras
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
