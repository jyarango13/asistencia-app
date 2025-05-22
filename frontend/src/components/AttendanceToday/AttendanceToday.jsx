import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Para hacer la solicitud al backend


const AttendanceToday = () => {

  const [data, setData] = useState([]); // Almacenar los datos recibidos
  const [loading, setLoading] = useState(true); // Controlar si los datos están cargando
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Registros por página
  const [searchQuery, setSearchQuery] = useState(''); // Filtro de búsqueda

  // Función para obtener los registros de la base de datos
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/asistenciaHoyDocentes');
      setData(response.data); // Establecer los datos en el estado
      console.log(response.data); // Mostrar los datos en la consola
      setLoading(false); // Terminar el proceso de carga
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  // Efecto para cargar los datos cuando el componente se monte
  useEffect(() => {
    fetchData();
  }, []);

  // Paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Establecer el número de registros por página

  // Filtro por nombre
  const filteredData = data.filter(item =>
    item.NOMBRES.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obtener los registros para la página actual
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast);


  // Aquí va la lógica para obtener las personas que marcaron asistencia hoy
  return (
    <div className="attendance-today">
      <div className="container">
        <h2 className="my-4">Asistencia de Hoy</h2>

        {/* Filtro de búsqueda */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Tabla de Asistencia */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>ROL</th>
              <th>Fecha de Ingreso</th>
              <th>Hora de Entrada</th>
              <th>Foto Ingreso</th>
              <th>Foto Salida</th>
              <th>Tardanza</th>
              <th>Extra</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8">Cargando...</td></tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.NOMBRES} {item.APELLIDOS}</td>
                  <td>{item.ROL}</td>
                  <td>{item["Entrada"]}</td>
                  <td>{item["Salida"]}</td>
                  <td><img src={`http://localhost:9000/asistencias/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${item.FotoIngreso}`} alt="Ingreso" width="50" /></td>
                  <td><img src={`http://localhost:9000/asistencias/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${item.FotoSalida}`} alt="Salida" width="50" /></td>
                  <td>{item["Tardanza"]} minutos</td>
                  <td>{item["ExtraHoras"]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <nav>
          <ul className="pagination justify-content-center">
            {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map((_, index) => (
              <li key={index + 1} className="page-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>


    </div>
  );
};

export default AttendanceToday;
