/**
 * @param {string} name - Nombre de la cookie
 * @param {string} value - Valor (el token, por ejemplo)
 * @param {number} days - Días de validez
 */
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}


const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';'); // Separamos todas las cookies
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Quitamos espacios
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Elimina una cookie específica por su nombre
 * @param {string} name - Nombre de la cookie a eliminar
 */
function removeCookie(name) {
  // Establecemos la fecha de expiración al 1 de enero de 1970
  // Max-Age=0 o un valor negativo también funciona en navegadores modernos
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
}

// Ejemplo de uso para tu token


export {
  setCookie,
  getCookie,
  removeCookie
}
