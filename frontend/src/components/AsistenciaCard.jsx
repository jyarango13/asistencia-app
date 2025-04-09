import React from 'react';
import './AsistenciaCard.css';
import CameraCapture from './CameraCapture';
import { useState,useRef } from 'react';
import enviarAsistencia from '../services/asistenciaService';

 //← ✅EN CASO NO HAYA CAMARA VERIFICAR CAMERA CAPTURE Y AQUI



const AsistenciaCard = () => {
const [dni, setDni] = useState("");
const cameraRef = useRef();


const handleRegistrar = async () => {
  if (cameraRef.current) {
    cameraRef.current.capture(); // ← Llama la función del hijo
  }

  // 2. Aquí puedes agregar más acciones luego de la foto:
  console.log("Foto capturada. Continuar registro con DNI:", dni);
  // submit form, guardar en BD, etc.
  const { success, error } = await enviarAsistencia(dni);
// cameraRef.current.toDataURL()
  if (success) {
    alert('✅ Asistencia registrada');
  } else {
    alert('❌ Error al registrar asistencia: ' + error);
  }
};

// //← ✅EN CASO NO HAYA CAMARA
//const isCameraReady = cameraRef.current?.isCameraReady;
 //← ✅EN CASO NO HAYA CAMARA 


  return (
    <div className='container'>

      <div className="card">
        <div className="card-header">
          <h1>ASISTENCIA</h1>
          <div className="date">Miércoles 26 de Marzo del 2025</div>
          <div className="time">9 : 11 : 17 PM</div>
        </div>

        <div className="card-body">
          <div className="form-section">
            <label htmlFor="dni">DNI</label>
            <input type="text" id="dni" name='dni'  placeholder="Ingrese su DNI" onChange={(event => { setDni(event.target.value) })} value={dni}/>
            <button onClick={handleRegistrar} 


          // ← ✅ EN CASO NO HAYA CAMARA, COMENTAR TAMBINE LINEA 26 ARRIBA
           //  disabled={!isCameraReady}
            //← ✅EN CASO NO HAYA CAMARA


             >
              REGISTRAR</button>
          </div>
          <div className="camera-section">
          <CameraCapture dni={dni} ref={cameraRef} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaCard;