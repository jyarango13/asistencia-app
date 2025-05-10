import React from 'react';

const AttendanceToday = () => {
  // Aquí va la lógica para obtener las personas que marcaron asistencia hoy
  return (
    <div className="attendance-today">
      <h2>Asistencia de Hoy</h2>
      <ul>
        <li>Juan Pérez - 09:05 AM</li>
        <li>Maria López - 09:10 AM</li>
        {/* Aquí debería renderizarse dinámicamente con datos reales */}
      </ul>
    </div>
  );
};

export default AttendanceToday;
