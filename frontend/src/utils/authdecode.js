/**
 * Función auxiliar interna para obtener una cookie por su nombre
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

/**
 * getAuthPayload devuelve el payload del token en json
 * @return {Object} payload en JSON
 */
function getAuthPayload() {
  const token = getCookie('user_token'); 
  const payload = token ? token.split('.')[1] : null;
  try {
    return payload ? JSON.parse(decodeURIComponent(escape(atob(payload)))) : {};
  } catch (e) {
    console.error("Error decodificando el token:", e);
    return {};
  }
}

/**
 * getToken devuelve el token almacenado en la cookie
 * @return {String|null} el token JWT
 */
function getToken() {
  return getCookie('user_token');
}

/**
 * getPersonId devuelve el identificador de la persona loggueada
 */
function getPersonId() {
  return getAuthPayload().id;
}

/**
 * getPersonUsuario devuelve el usuario completo
 */
function getPersonUsuario() {
  return getAuthPayload().usuario;
}

/**
 * getPersonNombre devuelve el nombre completo
 */
function getPersonNombre() {
  return getAuthPayload().nombre;
}

/**
 * getPersonApellido devuelve el apellido completo
 */
function getPersonApellido() {
  return getAuthPayload().apellido;
}

/**
 * getRol devuelve el rol de la persona loggueada
 */
function getRol() {
  return getAuthPayload().rol;
}

export {
  getPersonId,
  getToken,
  getPersonUsuario,
  getRol,
  getPersonNombre,
  getPersonApellido,
};