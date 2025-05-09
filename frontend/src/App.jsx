import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceCard from './components/AttendanceIni/AttendanceCard.jsx';

function App() {
  return (
    <div className='background'>
      <>
        <div className="container d-flex justify-content-center align-items-center vh-100">
          <div >
            <AttendanceCard />

          </div>
        </div>
      </>
    </div>
  );
}

export default App;
