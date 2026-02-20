
function validateObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { isValid: false, mensaje: "El valor proporcionado no es un objeto válido." };
  }
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return { isValid: false, mensaje: "El objeto está vacío." };
  }
  for (let key of keys) {
    const value = obj[key];
    const isEmpty = 
      value === null || 
      value === undefined || 
      (typeof value === 'string' && value.trim() === '');
    if (isEmpty) {
      return { 
        isValid: false, 
        mensaje: `El campo '${key}' está vacío o no es válido.` 
      };
    }
  }
  return { isValid: true, mensaje: "Todos los campos están completos." };
}

module.exports = {
  validateObject
}