const rules = {
    required: value => !!value || 'Campo requerido',
    empty: value => (value && value.toString().trim() !== '') || 'Campo vacío',
    positive: value => value > 0 || 'Debe ser un número positivo'
}

export {
    rules,
}