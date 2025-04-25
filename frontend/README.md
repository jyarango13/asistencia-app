# Getting Started with Create React App
src/
├── api/
│   ├── axiosInstance.js      ← axios.create aquí
│   ├── asistenciaApi.js      ← peticiones (local o remotas)
│   └── mock/                 ← opcional: mocks o local fallback
│       └── localStore.js
├── components/
│   └── AsistenciaCard.jsx
├── services/
│   └── asistenciaService.js  ← lógica pura, conecta UI + api
├── App.js

node index.js  
npm start frontend