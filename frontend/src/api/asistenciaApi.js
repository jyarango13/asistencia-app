// src/api/asistenciaApi.js
import api from './axiosInstance';

export const registrarAsistencia = async ({ dni, fotoBase64 }) => {
  const res = await api.post('/asistencia', {
    dni,
    imagen: fotoBase64
  });
  return res.data;
};
