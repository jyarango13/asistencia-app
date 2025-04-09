// src/services/asistenciaService.js
import { registrarAsistencia } from '../api/asistenciaApi';

 const enviarAsistencia = async (dni) => {
  try {
    const res = await registrarAsistencia({ dni });
    return { success: true, data: res };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export default enviarAsistencia;
