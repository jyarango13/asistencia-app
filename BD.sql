-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_asistencia;
USE sistema_asistencia;

-- Tabla de ROLES
CREATE TABLE IF NOT EXISTS roles (
    id CHAR(4) PRIMARY KEY, -- Clave primaria personalizada
    nombre VARCHAR(100) NOT NULL
);

-- Insertar roles (Ej: Docente, Administrativo, etc.)
INSERT INTO roles (id, nombre) VALUES
('R001', 'Docente'),
('R002', 'Administrativo'),
('R003', 'Docente TP');

-- Tabla de DEPARTAMENTOS
CREATE TABLE IF NOT EXISTS departamentos (
    id CHAR(4) PRIMARY KEY, -- Clave primaria personalizada
    nombre VARCHAR(255) NOT NULL
);

-- Insertar departamentos
INSERT INTO departamentos (id, nombre) VALUES
('D001', 'FARMACOTECNIA'),
('D002', 'FARMACOLOGIA'),
('D003', 'QUIMICA BASICA');

-- Tabla de PERSONAS
CREATE TABLE IF NOT EXISTS personas (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Clave primaria personalizada
    dni VARCHAR(8) NOT NULL,
    nombres VARCHAR(250) NOT NULL,
    apellidos VARCHAR(250) NOT NULL,
    departamento_id CHAR(4) NOT NULL,
    rol_id CHAR(4) NOT NULL,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Insertar personas
INSERT INTO personas (dni,nombres,apellidos, departamento_id, rol_id) VALUES 
(47736164,'Juan','Pérez', 'D001', 'R001'),
(08063663,'Sixto','Gonzalez', 'D001', 'R002'),
(11111111,'Maria','Ruiz', 'D002', 'R001'),
(55555555,'Paul','Roma', 'D003', 'R003'),
(44444444,'Ana',' Gómez', 'D002', 'R002');


-- Tabla de TIPOASISTENCIA
CREATE TABLE IF NOT EXISTS tipo_asistencia (
    id CHAR(4) PRIMARY KEY, -- Clave primaria personalizada
    nombre VARCHAR(50) NOT NULL
);

-- Insertar tipos de asistencia (Ej: Entrada, Salida, Tardanza, etc.)
INSERT INTO tipo_asistencia (id, nombre) VALUES
('A001', 'Ingreso'),
('A002', 'Salida'),
('A003', 'Tardanza'),
('A004', 'Ausencia');

-- Tabla de EVIDENCIAS (Imagenes, Documentos, etc.)
CREATE TABLE IF NOT EXISTS evidencias (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Clave primaria personalizada
    tipo VARCHAR(50), -- Tipo de evidencia (Imagen, Documento, etc.)
    url_evidencia VARCHAR(255) -- URL o ruta del archivo de evidencia
);

-- Insertar evidencias (Ejemplo)
INSERT INTO evidencias (tipo, url_evidencia) 
VALUES 
('Imagen', '/imagenes/ingreso.jpg'); -- Ejemplo de evidencia de ingreso


-- Tabla de JUSTIFICACIONES
CREATE TABLE IF NOT EXISTS justificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Clave primaria personalizada
    persona_id INT NOT NULL,
    fecha DATE NOT NULL,
    motivo TEXT,
    evidencia_id INT DEFAULT NULL, -- Evidencia (si aplica)
    FOREIGN KEY (persona_id) REFERENCES personas(id),
    FOREIGN KEY (evidencia_id) REFERENCES evidencias(id)
);


-- Tabla de ASISTENCIAS
CREATE TABLE IF NOT EXISTS asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Clave primaria personalizada
    persona_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    fecha DATE NOT NULL,
    tipo_asistencia_id CHAR(4) NOT NULL, -- A001 para Ingreso, A002 para Salida
    evidencia_asi VARCHAR(250), -- para agregar la imagen de evidencia de asistencia
    valido BOOLEAN DEFAULT TRUE, -- Si la asistencia es válida
    justificacion_id INT DEFAULT NULL, -- Justificación (si aplica)
    evidencia_id INT DEFAULT NULL, -- Evidencia (si aplica)
    FOREIGN KEY (persona_id) REFERENCES personas(id),
    FOREIGN KEY (tipo_asistencia_id) REFERENCES tipo_asistencia(id),
    FOREIGN KEY (justificacion_id) REFERENCES justificaciones(id),
    FOREIGN KEY (evidencia_id) REFERENCES evidencias(id)
);

-- Insertar asistencias (Ejemplo de ingreso y salida)
INSERT INTO asistencias ( persona_id, fecha_hora,fecha, tipo_asistencia_id) 
VALUES 
( 1, '2025-04-25 08:30:00','2025-04-25', 'A001'), -- Ingreso de Juan Pérez
( 2, '2025-04-25 17:30:00','2025-04-25', 'A002'); -- Salida de Juan Pérez




-- Tabla de HORARIOS PERMITIDOS
CREATE TABLE IF NOT EXISTS horarios_permitidos (
    id CHAR(4) PRIMARY KEY, -- Clave primaria personalizada
    rol_id CHAR(4) NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Insertar horarios permitidos (Ejemplo de horarios para los roles)
INSERT INTO horarios_permitidos (id, rol_id, hora_inicio, hora_fin) 
VALUES 
('H001', 'R001', '08:00:00', '18:00:00'), -- Horarios para docentes
('H002', 'R002', '11:00:00', '13:00:00'), -- Horarios para docentes
('H003', 'R003', NULL, NULL); -- Horarios para administrativos





