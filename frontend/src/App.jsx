import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import AttendanceCard from './components/AttendanceIni/AttendanceCard.jsx';
import { Route, Routes } from 'react-router-dom'; // Importa Routes y Route
import AttendanceCard from './components/AttendanceIni/AttendanceCard.jsx';
import Attendance from './components/AttendanceToday/Attendance.jsx'; // Asegúrate de importar el componente Attendance

function App() {
  return (
    <div className='background'>
      <>
        <div className="container d-flex justify-content-center align-items-center vh-100">
          <Routes> {/* Envuelve las rutas con Routes */}
            {/* Ruta para la página principal */}
            <Route path="/" element={<AttendanceCard />} />
            {/* Ruta para /asistenciahoy */}
            <Route path="/asistenciahoydocente" element={<Attendance />} />

          </Routes>

        </div>
      </>
    </div>
  );
}

export default App;

