// src/api/asistenciaApi.js
import api from './axiosInstance';

export const registrarAsistencia = async ({ dni }) => {
  const res = await api.post('/asistencia', {
    dni,
  });
  return res.data;
};
