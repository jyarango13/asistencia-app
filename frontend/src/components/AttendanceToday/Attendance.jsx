import React from 'react';
import AttendanceToday from './AttendanceToday';
import NoEntryList from './NoEntryList';
import ExitNoEntryList from './ExitNoEntryList';
import './Attendance.css'; // Estilos

const Attendance = () => {
  return (
    <div className="attendance-container">
      <div className="section-a">
        <AttendanceToday />
      </div>
      <div className="section-b">
        <div className="upper-b">
          <NoEntryList />
        </div>
        <div className="lower-b">
          <ExitNoEntryList />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
