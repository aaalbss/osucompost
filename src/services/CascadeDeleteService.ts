// src/services/cascadeDeleteService.ts

const API_BASE_URL = 'api';

/**
 * Servicio para eliminar un propietario y todos sus datos relacionados en cascada
 */
class CascadeDeleteService {
  
  /**
   * Elimina un propietario y todos sus datos relacionados en cascada
   * @param dniPropietario - DNI del propietario a eliminar
   * @returns Promise que se resuelve cuando el proceso ha terminado
   */
  async eliminarPropietarioEnCascada(dniPropietario: string): Promise<void> {
    try {
      console.log(`Iniciando eliminación en cascada para propietario: ${dniPropietario}`);
      
      // 1. Obtener todos los datos necesarios
      const [recogidas, contenedores, puntosRecogida, facturaciones] = await Promise.all([
        this.fetchData<any[]>(`${API_BASE_URL}/recogidas`),
        this.fetchData<any[]>(`${API_BASE_URL}/contenedores`),
        this.fetchData<any[]>(`${API_BASE_URL}/puntos-recogida`),
        this.fetchData<any[]>(`${API_BASE_URL}/facturaciones`)
      ]);
      
      // 2. Filtrar elementos relacionados con el propietario
      const puntosDelPropietario = puntosRecogida.filter(
        punto => punto.propietario && punto.propietario.dni === dniPropietario
      );
      
      const idsPuntosDelPropietario = puntosDelPropietario.map(punto => punto.id);
      
      const contenedoresDelPropietario = contenedores.filter(
        cont => cont.puntoRecogida && 
        cont.puntoRecogida.propietario && 
        cont.puntoRecogida.propietario.dni === dniPropietario
      );
      
      const idsContenedoresDelPropietario = contenedoresDelPropietario.map(cont => cont.id);
      
      const recogidasDelPropietario = recogidas.filter(
        rec => rec.contenedor && 
        rec.contenedor.puntoRecogida && 
        rec.contenedor.puntoRecogida.propietario && 
        rec.contenedor.puntoRecogida.propietario.dni === dniPropietario
      );
      
      const facturacionesDelPropietario = facturaciones.filter(
        fac => fac.propietario && fac.propietario.dni === dniPropietario
      );
      
      // Mostrar resumen de los datos a eliminar
      console.log(`Recogidas a eliminar: ${recogidasDelPropietario.length}`);
      console.log(`Contenedores a eliminar: ${contenedoresDelPropietario.length}`);
      console.log(`Puntos de recogida a eliminar: ${puntosDelPropietario.length}`);
      console.log(`Facturaciones a eliminar: ${facturacionesDelPropietario.length}`);
      
      // 3. Eliminar en cascada - primero recogidas
      for (const recogida of recogidasDelPropietario) {
        await this.deleteResource(`${API_BASE_URL}/recogidas/${recogida.id}`);
      }
      
      // 4. Eliminar contenedores
      for (const contenedor of contenedoresDelPropietario) {
        await this.deleteResource(`${API_BASE_URL}/contenedores/${contenedor.id}`);
      }
      
      // 5. Eliminar puntos de recogida
      for (const punto of puntosDelPropietario) {
        await this.deleteResource(`${API_BASE_URL}/puntos-recogida/${punto.id}`);
      }
      
      // 6. Eliminar facturaciones
      for (const facturacion of facturacionesDelPropietario) {
        await this.deleteResource(`${API_BASE_URL}/facturaciones/${facturacion.id}`);
      }
      
      // 7. Finalmente, eliminar propietario
      await this.deleteResource(`${API_BASE_URL}/propietarios/${dniPropietario}`);
      
      console.log(`Propietario ${dniPropietario} y sus datos relacionados eliminados correctamente`);
    } catch (error) {
      console.error('Error en el proceso de eliminación en cascada:', error);
      throw new Error('No se pudo completar la eliminación en cascada');
    }
  }
  
  /**
   * Función auxiliar para obtener datos de la API
   */
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${url}: ${response.statusText}`);
    }
    return response.json();
  }
  
  /**
   * Función auxiliar para eliminar un recurso
   */
  private async deleteResource(url: string): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      console.log(`Recurso eliminado: ${url}`);
    } catch (error) {
      console.error(`Error al eliminar recurso ${url}:`, error);
      throw error;
    }
  }
}

export const cascadeDeleteService = new CascadeDeleteService();