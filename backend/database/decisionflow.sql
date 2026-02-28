-- 1. ELIMINAR Y CREAR LA BASE DE DATOS
DROP DATABASE IF EXISTS decisionflow;
CREATE DATABASE decisionflow;
USE decisionflow;

-- 2. ESTRUCTURA DE TABLAS

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usu VARCHAR(200) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    apellido VARCHAR(200) NOT NULL,
    usuario VARCHAR(200) UNIQUE NOT NULL,
    clave VARCHAR(300) NOT NULL,
    cedula VARCHAR(16) UNIQUE NOT NULL,
    activo TINYINT DEFAULT 1,
    rol ENUM('Admin', 'admin', 'Auditor','auditor', 'Miembro', 'miembro') DEFAULT 'Miembro',
    change_pass TINYINT DEFAULT 1
);

-- Tabla de equipos
CREATE TABLE equipos (
    id_equi VARCHAR(200) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_responsable VARCHAR(200),
    FOREIGN KEY (id_responsable) REFERENCES usuarios(id_usu) ON DELETE SET NULL,
    INDEX idx_responsable_equi (id_responsable)
);

-- Tabla de miembros de equipos
CREATE TABLE miembros (
    id_equi VARCHAR(200),
    id_usu VARCHAR(200),
    rol ENUM('Asistente', 'Jefe', 'Miembro') DEFAULT 'Miembro',
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_equi, id_usu),
    FOREIGN KEY (id_equi) REFERENCES equipos(id_equi) ON DELETE CASCADE,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id_usu) ON DELETE CASCADE,
    INDEX idx_miembro_usu (id_usu)
);

-- Tabla de proyectos
CREATE TABLE proyecto (
    id_pro VARCHAR(200) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion VARCHAR(300),
    id_equipo VARCHAR(200) NULL,
    estado ENUM('Activo', 'Completado', 'Cancelado') DEFAULT 'Activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio TIMESTAMP NULL,
    fecha_cierre TIMESTAMP NULL,
    id_responsable VARCHAR(200) NULL,
    documento VARCHAR(500) NULL,
    imagen VARCHAR(500) NULL,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equi) ON DELETE SET NULL,
    FOREIGN KEY (id_responsable) REFERENCES usuarios(id_usu) ON DELETE SET NULL,
    INDEX idx_equipo (id_equipo),
    INDEX idx_responsable (id_responsable)
);

-- Tabla de decisiones
CREATE TABLE decisiones (
    id_deci VARCHAR(200) PRIMARY KEY,
    id_pro VARCHAR(200),
    titulo VARCHAR(200) NOT NULL,
    descripcion VARCHAR(300),
    id_creador VARCHAR(200),
    estado ENUM('abierta', 'cerrada', 'en evaluacion') DEFAULT 'abierta',
    valoracion INT DEFAULT 0,
    resultado TEXT,
    impacto VARCHAR(100),
    observacion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pro) REFERENCES proyecto(id_pro) ON DELETE CASCADE,
    FOREIGN KEY (id_creador) REFERENCES usuarios(id_usu) ON DELETE SET NULL,
    INDEX idx_proyecto (id_pro),
    INDEX idx_creador (id_creador)
);

-- Tabla de valoración decisiones
CREATE TABLE valoracion_dec (
    id_val VARCHAR(200) PRIMARY KEY,
    puntaje INT NOT NULL,
    id_creador VARCHAR(200),
    id_deci VARCHAR(200),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_creador) REFERENCES usuarios(id_usu) ON DELETE CASCADE,
    FOREIGN KEY (id_deci) REFERENCES decisiones(id_deci) ON DELETE CASCADE,
    INDEX idx_creador_val (id_creador),
    INDEX idx_deci_val (id_deci)
);

CREATE TABLE comentarios_dec (
    id_com_dec INT AUTO_INCREMENT PRIMARY KEY,
    id_val VARCHAR(200),
    comentario TEXT NOT NULL,
    FOREIGN KEY (id_val) REFERENCES valoracion_dec(id_val) ON DELETE CASCADE
);

-- Tabla de ideas
CREATE TABLE ideas (
    id_idea VARCHAR(200) PRIMARY KEY,
    id_pro VARCHAR(200),
    titulo VARCHAR(200) NOT NULL,
    descripcion VARCHAR(300),
    id_creador VARCHAR(200),
    valoracion INT DEFAULT 0,
    estado ENUM('activa', 'evaluada', 'descarta') DEFAULT 'activa',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pro) REFERENCES proyecto(id_pro) ON DELETE CASCADE,
    FOREIGN KEY (id_creador) REFERENCES usuarios(id_usu) ON DELETE SET NULL, -- FK Agregada
    INDEX idx_proyecto_idea (id_pro),
    INDEX idx_creador_idea (id_creador)
);

-- Tabla de valoración ideas
CREATE TABLE valoracion_idea (
    id_val VARCHAR(200) PRIMARY KEY,
    puntaje INT NOT NULL,
    id_creador VARCHAR(200),
    id_idea VARCHAR(200),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_creador) REFERENCES usuarios(id_usu) ON DELETE CASCADE,
    FOREIGN KEY (id_idea) REFERENCES ideas(id_idea) ON DELETE CASCADE,
    INDEX idx_creador_val_i (id_creador),
    INDEX idx_idea_val (id_idea)
);

-- Tabla de comentarios ideas
CREATE TABLE comentarios_idea (
    id_com_idea INT AUTO_INCREMENT PRIMARY KEY,
    id_val VARCHAR(200),
    comentario TEXT NOT NULL,
    FOREIGN KEY (id_val) REFERENCES valoracion_idea(id_val) ON DELETE CASCADE
);

-- 3. INSERTAR DATOS (SEEDS)
INSERT INTO usuarios (id_usu, nombre, apellido, usuario, clave, cedula, rol, change_pass) VALUES 
('1', 'Admin', 'Admin', 'admin', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C','Admin', 'Miembro', 0),
('2', 'Juan', 'Pérez', 'jperez', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-10203040', 'Miembro', 0),
('3', 'María', 'García', 'mgarcia', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-20304050', 'Miembro', 0),
('4', 'Carlos', 'López', 'clopez', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-30405060', 'Miembro', 0),
('5', 'Ana', 'Martínez', 'amartinez', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-40506070', 'Miembro', 0),
('6', 'Luis', 'Rodríguez', 'lrodriguez', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-50607080', 'Miembro', 0),
('7', 'Elena', 'Torres', 'etorres', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-60708090', 'Auditor', 0),
('8', 'Roberto', 'Sanz', 'rsanz', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-70809010', 'Admin', 0),
('9', 'Lucía', 'Méndez', 'lmendez', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-80901020', 'Miembro', 0),
('10', 'Ricardo', 'Díaz', 'rdiaz', '$2b$10$QxUMeBppML2Q2QEWQvFLxOC8fr47UPuY.25CEADzhZHKWX77e15/C', 'V-90102030', 'Miembro', 0);

INSERT INTO equipos (id_equi, nombre, descripcion, id_responsable) VALUES 
('EQUI-001', 'Equipo de Desarrollo', 'Encargados de la programación y mantenimiento del software.', '1'),
('EQUI-002', 'Equipo de Diseño UX/UI', 'Enfocados en la experiencia de usuario y diseño visual.', '3'),
('EQUI-003', 'Equipo de Calidad (QA)', 'Aseguramiento de la calidad y pruebas de estrés.', '7');

INSERT INTO miembros (id_equi, id_usu, rol, fecha_ingreso) VALUES 
('EQUI-001', '1', 'Jefe', CURRENT_TIMESTAMP),
('EQUI-001', '2', 'Miembro', CURRENT_TIMESTAMP),
('EQUI-001', '4', 'Asistente', CURRENT_TIMESTAMP),
('EQUI-002', '3', 'Jefe', CURRENT_TIMESTAMP),
('EQUI-002', '5', 'Miembro', CURRENT_TIMESTAMP),
('EQUI-002', '9', 'Miembro', CURRENT_TIMESTAMP),
('EQUI-003', '7', 'Jefe', CURRENT_TIMESTAMP),
('EQUI-003', '6', 'Miembro', CURRENT_TIMESTAMP),
('EQUI-003', '10', 'Asistente', CURRENT_TIMESTAMP);

INSERT INTO `proyecto` (`id_pro`, `nombre`, `descripcion`, `id_equipo`, `estado`, `fecha_creacion`, `fecha_inicio`, `fecha_cierre`, `id_responsable`, `documento`, `imagen`) VALUES 
('PRJ-001', 'Rediseño de Interfaz', 'Actualización estética del dashboard principal.', 'EQUI-002', 'Activo', CURRENT_TIMESTAMP, '2024-01-15 08:00:00', NULL, '3', NULL, NULL),
('PRJ-002', 'Migración de Servidores', 'Mover la infraestructura a una nueva arquitectura en la nube.', 'EQUI-001', 'Activo', CURRENT_TIMESTAMP, '2024-02-01 10:30:00', NULL, '1', NULL, NULL),
('PRJ-003', 'Campaña Marketing Q1', 'Planificación de redes sociales para el primer trimestre.', NULL, 'Completado', CURRENT_TIMESTAMP, '2023-12-01 09:00:00', '2024-02-20 17:00:00', NULL, NULL, NULL),
('PRJ-004', 'App Móvil Versión 2.0', 'Desarrollo de nuevas funcionalidades nativas para iOS y Android.', 'EQUI-001', 'Activo', CURRENT_TIMESTAMP, '2024-03-01 08:00:00', NULL, '4', NULL, NULL),
('PRJ-005', 'Auditoría de Seguridad', 'Revisión anual de protocolos y vulnerabilidades.', 'EQUI-003', 'Cancelado', CURRENT_TIMESTAMP, '2024-01-10 11:00:00', '2024-01-15 15:00:00', '7', NULL, NULL),
('PRJ-006', 'Optimización de Base de Datos', 'Limpieza de logs y optimización de índices pesados.', 'EQUI-001', 'Activo', CURRENT_TIMESTAMP, '2024-02-15 14:00:00', NULL, '1', NULL, NULL);

INSERT INTO decisiones (id_deci, id_pro, titulo, descripcion, id_creador, estado, valoracion, impacto) VALUES 
('DEC-004', 'PRJ-002', 'Base de Datos para Logs', '¿Usar MongoDB o una tabla relacional para el historial?', '1', 'en evaluacion', 5, 'Alto'),
('DEC-005', 'PRJ-003', 'Canal de Comunicación', 'Definir si se usará Slack o Microsoft Teams.', '8', 'cerrada', 9, 'Medio'),
('DEC-006', 'PRJ-004', 'Pasarela de Pagos', 'Integración con Stripe o PayPal.', '4', 'abierta', 0, 'Alto'),
('DEC-007', 'PRJ-001', 'Librería de Gráficas', '¿Chart.js o D3.js para las estadísticas?', '3', 'abierta', 0, 'Bajo');

INSERT INTO valoracion_dec (id_val, puntaje, id_creador, id_deci) VALUES 
('VALD-003', 2, '5', 'DEC-004'),
('VALD-004', 5, '2', 'DEC-005'),
('VALD-005', 4, '3', 'DEC-005');

INSERT INTO comentarios_dec (id_val, comentario) VALUES 
('VALD-003', 'MongoDB podría ser overkill si no tenemos tantos datos.'),
('VALD-004', 'Slack tiene mejores integraciones con nuestras herramientas actuales.'),
('VALD-005', 'De acuerdo, la interfaz es mucho más intuitiva.');

INSERT INTO ideas (id_idea, id_pro, titulo, descripcion, id_creador, estado, valoracion) VALUES 
('IDEA-004', 'PRJ-001', 'Exportar a PDF', 'Generar reportes de las decisiones tomadas en PDF.', '10', 'activa', 5),
('IDEA-005', 'PRJ-003', 'Bot de Bienvenida', 'Un bot que asigne tareas automáticamente a nuevos miembros.', '7', 'activa', 0),
('IDEA-006', 'PRJ-002', 'Caché con Redis', 'Implementar Redis para acelerar las consultas frecuentes.', '2', 'evaluada', 4),
('IDEA-007', 'PRJ-004', 'Soporte Multi-idioma', 'Añadir i18n para soportar inglés y español.', '5', 'descarta', 1);

INSERT INTO valoracion_idea (id_val, puntaje, id_creador, id_idea) VALUES 
('VALI-003', 5, '1', 'IDEA-004'),
('VALI-004', 1, '4', 'IDEA-007'),
('VALI-005', 4, '5', 'IDEA-006');

INSERT INTO comentarios_idea (id_val, comentario) VALUES 
('VALI-003', 'Es fundamental para las reuniones de gerencia.'),
('VALI-004', 'Por ahora no es prioridad, enfoquémonos en el mercado local.'),
('VALI-005', 'Redis nos ayudaría mucho con la latencia del servidor actual.');