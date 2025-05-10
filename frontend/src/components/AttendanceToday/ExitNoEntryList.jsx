import React from 'react';

const ExitNoEntryList = () => {
  // Aquí va la lógica para obtener las personas que marcaron salida pero no ingreso
  return (
    <div className="exit-no-entry-list">
      <h2>Salida sin Ingreso</h2>
      <ul>
        <li>Pedro García</li>
        <li>Lucía Martínez</li>
        {/* Aquí debería renderizarse dinámicamente con datos reales */}
      </ul>
    </div>
  );
};

export default ExitNoEntryList;
