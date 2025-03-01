/**
 * Función para obtener el nombre formateado de un tipo de residuo según su ID
 * @param {number} id - El ID del tipo de residuo
 * @returns {string} - El nombre correctamente formateado con acentos
 */
export const getNombreResiduoPorId = (id: number): string => {
    const mapaResiduos: Record<number, string> = {
      1: 'Orgánico',      // Antes "Organico"
      2: 'Estructurante', // Antes "Estructurante"
      // Añadir más IDs según sea necesario
    };
    
    return mapaResiduos[id] || '';
  };
  
  /**
   * Función para formatear un objeto de tipo de residuo completo
   * @param {object} tipoResiduo - El objeto de tipo de residuo con id y descripcion
   * @returns {object} - El mismo objeto con la descripción correctamente formateada
   */
  export const formatearTipoResiduo = (tipoResiduo: { id: number, descripcion: string }) => {
    if (!tipoResiduo || !tipoResiduo.id) return tipoResiduo;
    
    return {
      ...tipoResiduo,
      descripcion: getNombreResiduoPorId(tipoResiduo.id) || tipoResiduo.descripcion
    };
  };