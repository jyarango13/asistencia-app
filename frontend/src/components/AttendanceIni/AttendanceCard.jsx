import React from 'react';
import './AttendanceCard.css';
import CameraCapture from './CameraCapture';
import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

//← ✅EN CASO NO HAYA CAMARA VERIFICAR CAMERA CAPTURE Y AQUI

//Importando este axios me permite capturar los mensajes de error del backend
// y mostrarlos en el frontend, como por ejemplo "Persona no encontrada con ese DNI"
import axios from 'axios';


const AttendanceCard = () => {
  const [dni, setDni] = useState("");
  const cameraRef = useRef();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Estado para controlar si el botón está habilitado o no
  const inputDniRef = useRef();
  const btnRegRef = useRef();
  const [currentTime, setCurrentTime] = useState({ date: '', time: '' });
  const [isLoading, setIsLoading] = useState(false); // Estado de loading
  const [isBackendAvailable, setIsBackendAvailable] = useState(true); //validar al iniciar si el backend esta disponible
  //const [isInputDisabled, setIsInputDisabled] = useState(false); // Controla si el input está deshabilitado


  const checkBackendConnection = async () => {
    try {
      // Realizar una solicitud GET simple para verificar si el backend responde
      await axios.get('http://localhost:9000/api/verify'); // Suponiendo que tienes esta ruta en el backend
      setIsBackendAvailable(true); // Backend disponible
    } catch (error) {
      setIsBackendAvailable(false); // Si no hay respuesta del servidor
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Actualiza la página. Si el problema persiste comunica a PERSONAL.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };


  // Al cargar la página, poner el foco en el input de DNI
  useEffect(() => {
    //verificar backend
    //verificacion de backend
    checkBackendConnection();
    //termina verificacion de backend

    inputDniRef.current.focus(); // Establecer el foco en el input de DNI al cargar la página
    // Actualizar la hora y fecha cuando el componente se monta
    getTimeAndDate();

    // Configuramos un intervalo que se ejecute cada segundo para actualizar la hora
    const interval = setInterval(() => {
      getTimeAndDate();
    }, 1000); // 1000 ms = 1 segundo

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);



  }, []);


  const interpretarFecha = (fecha) => {

    const diasDeLaSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const mesesDelAño = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Obtener el día de la semana (lunes, martes, etc.)
    const diaDeLaSemana = diasDeLaSemana[fecha.getDay()];

    // Obtener el día del mes
    const diaDelMes = fecha.getDate();

    // Obtener el mes en formato de texto (enero, febrero, marzo, etc.)
    const mesDelAño = mesesDelAño[fecha.getMonth()];

    // Obtener el año
    const año = fecha.getFullYear();

    // Formatear la fecha como 'Lunes 29 de Abril de 2025'
    const fechaFormateada = `${diaDeLaSemana.charAt(0).toUpperCase() + diaDeLaSemana.slice(1)} ${diaDelMes} de ${mesDelAño.charAt(0).toUpperCase() + mesDelAño.slice(1)} de ${año}`;

    return fechaFormateada;
  };

  // Formatear la hora y fecha a la hora de Lima (zona horaria 'America/Lima')
  const getTimeAndDate = () => {
    const fechaHora = new Date(); // Fecha y hora actual del navegador
    //const options = { timeZone: 'America/Lima' }; // Hora de Lima
    const resultado = interpretarFecha(fechaHora);
    // Formatear la fecha en formato 'DD de mes de YYYY' (ej. 26 de Marzo del 2025)
    //const fechaActual = fechaHora.toLocaleDateString('es-ES', options).replace(/\//g, ' de ');
    // Formatear la hora en formato 'HH:mm:ss' (ej. 09:11:17)
    const horaActual = fechaHora.toLocaleTimeString('en-GB', { timeZone: 'America/Lima' });

    // Actualizar el estado con la hora y fecha actual
    setCurrentTime({
      date: resultado,
      time: horaActual,
    });
  };

  // Función que maneja el cambio del input de DNI
  const handleInputChange = (event) => {
    let value = event.target.value;

    // Filtrar solo números, eliminando cualquier otro carácter no numérico
    value = value.replace(/[^0-9]/g, '');

    // Limitar la longitud a 8 caracteres
    if (value.length <= 8) {
      setDni(value); // Actualizar el estado con el nuevo valor
    }

    // Habilitar el botón de registrar si el DNI tiene 8 caracteres
    if (value.length === 8) {
      setIsButtonDisabled(false); // Habilitar el botón
    } else {
      setIsButtonDisabled(true); // Deshabilitar el botón si el DNI no tiene 8 caracteres
    }
  };

  // Función para manejar la tecla Enter
  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter' && dni.length === 8) {
      event.preventDefault();
      btnRegRef.current.click(); // Simula un clic en el botón de registrar
    }
  };

  const handleRegistrar = async () => {

    checkBackendConnection();

    //verifcando backend
    if (!isBackendAvailable) {
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Actualiza la página. Si el problema persiste comunica a PERSONAL.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    setIsLoading(true); // Activar el loading
    //para el nombre de la imagen
    const now = new Date();
    const filename = `f-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-h-${now.getHours()}-${now.getMinutes()}-d-${now.getDay()}-${dni}.jpg`;


    try {
      // Capturar la imagen del canvas
      //captura del hijo
      const imageData = cameraRef.current.capture();
      // Realiza la solicitud POST al backend
      const response = await axios.post('http://localhost:9000/api/asistencia', {
        dni,
        image: imageData,  // Enviar los datos de la imagen al backend
        filename,            // Enviar el nombre del archivo
      });

      // Si la respuesta es exitosa, muestra el mensaje
      if (response.data.success) {
       
        // Si la respuesta es exitosa, llama a la función de captura de la cámara
        // if (cameraRef.current) {
        //   cameraRef.current.capture(); // ← Llama la función del hijo
        // }
        // ('✅ Asistencia registrada exitosamente');
        Swal.fire({
          title: 'Asistencia OK',
          //text: '✅ Asistencia registrada exitosamente',
          html: response.data.message,
          icon: 'success',
          iconColor: response.data.tipo === 'A002' ? '#4592e5' : undefined,
          confirmButtonText: 'Aceptar',
          timer: 3000 // 3 segundos
        });
        setDni(''); // Limpiar el input cuando la asistencia sea exitosa
        inputDniRef.current.focus(); // Volver a poner el foco en el input de DNI

      }
    }


    catch (error) {


      // La solicitud fue realizada y el servidor respondió con un estado de error
      if (error.response.status === 404 && error.response.data.message === "Persona no encontrada con ese DNI") {
        //('❌ ' + error.response.data.message);
        Swal.fire({
          title: 'Error DNI',
          html: error.response.data.message,
          icon: 'error',
          confirmButtonText: 'Aceptar',

        });
        inputDniRef.current.focus(); // Volver a poner el foco en el input de DNI
      }

      else {
        // Si no se puede obtener el mensaje, mostrar un error genérico
        setDni(''); // Limpiar el input cuando el error sea diferente
        Swal.fire({
          title: 'Error Asistencia',
          html: error.response.data.message,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        inputDniRef.current.focus(); // Volver a poner el foco en el input de DNI
      }


    }
    finally {
      setIsLoading(false); // Desactivar el loading una vez terminada la solicitud
    }

  };

  // //← ✅EN CASO NO HAYA CAMARA
  const isCameraReady = cameraRef.current?.isCameraReady;
  //← ✅EN CASO NO HAYA CAMARA 


  return (
    <div className='container'>

      <div className="card">
        <div className="card-header">
          <h1>ASISTENCIA FARMACIA 2025</h1>
          <div className="date">{currentTime.date}</div>
          <div className="time">{currentTime.time}</div>
        </div>

        <div className="card-body">
          <div className="form-section">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              placeholder="Ingrese su DNI"

              onChange={handleInputChange}
              maxLength="8"
              onKeyDown={handleEnterKeyPress} // Escuchar la tecla Enter
              ref={inputDniRef} // Usar ref para acceder al input

              // onChange={(event => { setDni(event.target.value) })}
              value={dni} />

            <button
              onClick={handleRegistrar}
              disabled={isButtonDisabled || !isCameraReady} // Deshabilitar el botón si el DNI no es válido
              ref={btnRegRef} // Usar ref para acceder al botón
              className={isButtonDisabled ? 'disabled' : ''} // Condicional para aplicar la clase disabled


            // ← ✅ EN CASO NO HAYA CAMARA, COMENTAR TAMBINE LINEA 26 ARRIBA
            //  disabled={!isCameraReady}
            //← ✅EN CASO NO HAYA CAMARA


            >
              REGISTRAR</button>
          </div>

          {/* Mostrar spinner mientras se carga */}
          {isLoading && (
            <div className="loading-container">
              <div className="spinner-border" role="status" />
              <div className="text-white">Cargando...</div>
            </div>
          )}

          <div className="camera-section">
            <CameraCapture dni={dni} ref={cameraRef} />

          </div>

        </div>
      </div>
    </div>

  );
};


export default AttendanceCard;