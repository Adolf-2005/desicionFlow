-- Tabla de roles
CREATE TABLE roles (
    id_rol VARCHAR(200) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usu VARCHAR(200) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    apellido VARCHAR(200) NOT NULL,
    usuario VARCHAR(200) UNIQUE NOT NULL,
    clave VARCHAR(300) NOT NULL,
    cedula VARCHAR(16) UNIQUE NOT NULL,
    activo TINYINT DEFAULT 1,
    id_rol VARCHAR(200),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE SET NULL
);

-- Tabla de equipos
CREATE TABLE equipos (
    id_equi VARCHAR(200) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_responsable VARCHAR(200),
    FOREIGN KEY (id_responsable) REFERENCES usuarios(id_usu) ON DELETE SET NULL
);

-- Tabla de miembros de equipos
CREATE TABLE miembros (
    id_equi VARCHAR(200),
    id_usu VARCHAR(200),
    rol ENUM('Asistente', 'Jefe', 'Miembro') DEFAULT 'Miembro',
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_equi, id_usu),
    FOREIGN KEY (id_equi) REFERENCES equipos(id_equi) ON DELETE CASCADE,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id_usu) ON DELETE CASCADE
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
    id_responsable VARCHAR(200),
    estado ENUM('abierta', 'cerrada', 'en evaluacion') DEFAULT 'abierta',
    valoracion INT DEFAULT 0,
    resultado TEXT,
    impacto TEXT,
    observacion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pro) REFERENCES proyecto(id_pro) ON DELETE CASCADE,
    FOREIGN KEY (id_creador) REFERENCES usuarios(id_usu) ON DELETE SET NULL,
    FOREIGN KEY (id_responsable) REFERENCES usuarios(id_usu) ON DELETE SET NULL,
    INDEX idx_proyecto (id_pro),
    INDEX idx_creador (id_creador),
    INDEX idx_responsable (id_responsable)
);

-- Tabla de ideas
CREATE TABLE ideas (
    id_idea VARCHAR(200) PRIMARY KEY,
    id_deci VARCHAR(200),
    titulo VARCHAR(200) NOT NULL,
    descripcion VARCHAR(300),
    id_creador VARCHAR(300),
    estado ENUM('activa', 'evaluada', 'descarta') DEFAULT 'activa',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_deci) REFERENCES decisiones(id_deci) ON DELETE CASCADE,
    INDEX idx_decision (id_deci)
);

-- Tabla de valoración
CREATE TABLE valoracion (
    id_val VARCHAR(200) PRIMARY KEY,
    puntaje INT NOT NULL,
    id_creador VARCHAR(200),
    id_idea VARCHAR(200),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_creador) REFERENCES usuarios(id_usu) ON DELETE CASCADE,
    FOREIGN KEY (id_idea) REFERENCES ideas(id_idea) ON DELETE CASCADE,
    INDEX idx_creador (id_creador),
    INDEX idx_idea (id_idea)
);

-- Tabla de comentarios
CREATE TABLE comentarios (
    id_val VARCHAR(200),
    comentario TEXT NOT NULL,
    FOREIGN KEY (id_val) REFERENCES valoracion(id_val) ON DELETE CASCADE
);
