import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AsistenciaCard from './components/AsistenciaCard.jsx';

function App() {
  return (
    <div className='background'>
      <>
        <div className="container d-flex justify-content-center align-items-center vh-100">
          <div >
            <AsistenciaCard />

          </div>
        </div>
      </>
    </div>
  );
}

export default App;
