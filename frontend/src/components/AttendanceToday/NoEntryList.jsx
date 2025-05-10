import React from 'react';

const NoEntryList = () => {
  // Aquí va la lógica para obtener las personas que no marcaron ingreso
  return (
    <div className="no-entry-list">
      <h2>No Marcaron Ingreso</h2>
      <ul>
        <li>Carlos Fernández</li>
        <li>Ana Sánchez</li>
        {/* Aquí debería renderizarse dinámicamente con datos reales */}
      </ul>
    </div>
  );
};

export default NoEntryList;
