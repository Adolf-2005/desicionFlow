/**
 * Capitaliza la primera letra de cada palabra en los strings de un objeto
 * @param {Object} obj - El objeto a transformar (ej. usuario)
 * @returns {Object} - Objeto con valores capitalizados
 */
function capitalizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const newObj = { ...obj };

  Object.keys(newObj).forEach(key => {
    if (typeof newObj[key] === 'string' && newObj[key].length > 0) {
      // Capitaliza: "JUAN" -> "Juan", "pedro perez" -> "Pedro Perez"
      newObj[key] = newObj[key]
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  });

  return newObj;
}

export {
  capitalizeObject
}