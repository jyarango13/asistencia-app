const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const fs = require('fs');
const path = require('path');
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

// Ponemos el servidor a escuchar
const PORT = 9000; // o el que prefieras
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

//para la imagen
const saveImage = (image, filename) => {
  // Obtener la fecha actual (año, mes, día)
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Asegurarse de que el mes tenga 2 dígitos
  const day = now.getDate().toString().padStart(2, '0'); // Asegurarse de que el día tenga 2 dígitos

  // Crear la ruta completa del directorio
  const baseDir = path.join('D:', 'proyectos', 'asistencia-app', 'asistencias');
  const yearDir = path.join(baseDir, year.toString());
  const monthDir = path.join(yearDir, month);
  const dayDir = path.join(monthDir, day);

  // Verificar si las carpetas existen, y si no, crearlas
  fs.mkdirSync(dayDir, { recursive: true });  // 'recursive: true' asegura que se creen todas las carpetas necesarias

  // Guardar la imagen en la ruta calculada
  const imagePath = path.join(dayDir, filename);
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
  console.log('Base64 Data Length:', base64Data.length);  // Verifica si la longitud es mayor que 0

  fs.writeFileSync(imagePath, base64Data, 'base64');
  // Retornar la URL de la imagen guardada
  const fileUrl = `http://localhost:9000/asistencias/${year}/${month}/${day}/${filename}`;
  //res.json({ success: true, fileUrl });
  console.log('Imagen guardada correctamente en:', fileUrl);

  //finaliza imagen
};

// Ruta para registrar asistencia
app.post('/api/asistencia', async (req, res) => {
  const { dni, image, filename } = req.body;


  try {
    // Paso 1: Verificar si el DNI existe
    const result = await query('SELECT id, nombres, apellidos, rol_id FROM personas WHERE dni = ?', [dni]);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Persona no encontrada con DNI: ' + dni });
    }

    //para comprobar horas
    const fechaHora = new Date(); // Marca de tiempo del servidor
    const options = { timeZone: 'America/Lima' }; // Hora de Lima
    const horaActual = `${fechaHora.getHours()}:${fechaHora.getMinutes()}`;
    const fechaActual = fechaHora.toLocaleDateString('en-CA', options); // Solo la fecha 'YYYY-MM-DD'

    const personaId = result[0].id;
    const nombres = result[0].nombres;
    const apellidos = result[0].apellidos;
    const rolId = result[0].rol_id;
    let textoAsistencia = '';

    // Paso 2: Obtener horarios permitidos para el rol
    const horarioResult = await query('SELECT hora_inicio, hora_fin FROM horarios_permitidos WHERE rol_id = ?', [rolId]);
    if (horarioResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Horarios no definidos para el rol' });
    }

    const { hora_inicio: horaInicio, hora_fin: horaFin } = horarioResult[0];

    // Paso 3: Validar si la hora actual está dentro del rango permitido
    let tipoAsistenciaId = validarHora(horaActual, horaInicio, horaFin);
    if (!tipoAsistenciaId) {
      return res.status(400).json({ success: false, message: 'Fuera del horario permitido para tu rol' });
    }

    const totalAsistencias = await query('SELECT COUNT(*) AS total FROM asistencias WHERE persona_id = ? AND DATE(fecha) = ?', [personaId, fechaActual]);
    //Devuelve el total de asistencias registradas para la persona en la fecha actual
    if (totalAsistencias[0].total > 1) {
      return res.status(400).json({ success: false, message: `Ya has registrado tu  <strong>Salida</strong> para hoy <br> ${nombres} ${apellidos}` });
    }

    // Paso 4: Verificar si ya existe un registro de asistencia para hoy
    const existingAsistencia = await query('SELECT * FROM asistencias WHERE persona_id = ? AND DATE(fecha) = ? AND tipo_asistencia_id = ?', [personaId, fechaActual, tipoAsistenciaId]);

    if (existingAsistencia.length === 0 && rolId === 'R003') {
      tipoAsistenciaId = 'A001'; // Ingreso
      textoAsistencia = 'Ingreso registrado'
    }
    else if (existingAsistencia.length === 1 && rolId === 'R003') {
      tipoAsistenciaId = 'A002'; // Salida
      textoAsistencia = 'Salida registrada'
    } 
    else if (existingAsistencia.length > 0) {
      let tipoAsistencia = tipoAsistenciaId === 'A001' ? 'Ingreso' : 'Salida';
      return res.status(400).json({ success: false, message: `Ya has registrado tu  <strong>${tipoAsistencia}</strong> para hoy <br> ${nombres} ${apellidos}` });
    }


    // Paso 5: Registrar la asistencia
    const insertResult = await query('INSERT INTO asistencias (persona_id, fecha_hora, fecha, tipo_asistencia_id, evidencia_asi) VALUES (?, ?, ?, ?, ?)', [personaId, fechaHora, fechaActual, tipoAsistenciaId, filename]);
    // Verificar si el INSERT fue exitoso antes de proceder a guardar la imagen
    if (insertResult.affectedRows > 0) {
      // Si la inserción fue exitosa, entonces guardar la imagen
      const imageUrl = saveImage(image, filename); // Llamar a saveImage para guardar la imagen

      // Devolver la respuesta con la URL de la imagen y mensaje de éxito
      textoAsistencia = tipoAsistenciaId === 'A001' ? 'Ingreso registrado' : 'Salida registrada';
      return res.json({ success: true, message: textoAsistencia + ' exitosamente: \n' + ' ' + nombres + ' ' + apellidos, tipo: tipoAsistenciaId });
    } else {
      return res.status(500).json({ success: false, message: 'Error al registrar la asistencia' });
    }

  } catch (err) {
    console.error('Error en la operación:', err);
    return res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
  }
});


app.get('/api/verify', (req, res) => {
  res.status(200).send('Servidor disponible');
  console.log('Servidor disponible');
});

// Función para ejecutar consultas de forma limpia usando Promesas
function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// Función para validar la hora actual con el rango permitido
function validarHora(horaActual, horaInicio, horaFin, asistencia) {
  // Asegurarse de que las horas estén siempre en formato de 2 dígitos
  const formatHora = (hora) => {
    const [h, m] = hora.split(':').map(num => num.padStart(2, '0'));
    return `${h}:${m}`;
  }
  let tipoAsistenciaId = null;

  if (!horaInicio || !horaFin) {
    // Para rol sin horarios definidos
    return tipoAsistenciaId = 'A001'; // Siempre permite ingreso (puedes cambiar a otra lógica si quieres)
  }

  // Aseguramos que todas las horas estén en el formato correcto de 'HH:mm'
  horaActual = formatHora(horaActual);
  horaInicio = formatHora(horaInicio);
  horaFin = formatHora(horaFin);

  const [horaInicioH, horaInicioM] = horaInicio.split(':').map(num => parseInt(num, 10));
  const [horaFinH, horaFinM] = horaFin.split(':').map(num => parseInt(num, 10));
  const [horaActualH, horaActualM] = horaActual.split(':').map(num => parseInt(num, 10));

  // Convertir todo a minutos para comparar
  const horaInicioEnMinutos = horaInicioH * 60 + horaInicioM;
  const horaFinEnMinutos = horaFinH * 60 + horaFinM;
  const horaActualEnMinutos = horaActualH * 60 + horaActualM;


  // Dependiendo del rol, asignar el tipo de asistencia
  // Si la hora está dentro del rango permitido, asignar ingreso o salida
  if (horaActualEnMinutos < horaInicioEnMinutos) {
    tipoAsistenciaId = 'A001'; // Ingreso
  } else if (horaActualEnMinutos > horaFinEnMinutos) {
    tipoAsistenciaId = 'A002'; // Salida
  }

  // Retornamos el tipo de asistencia calculado
  return tipoAsistenciaId;
}
