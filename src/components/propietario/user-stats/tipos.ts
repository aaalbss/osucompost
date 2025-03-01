// tipos.ts
export interface TipoResiduo {
    id: number;
    descripcion: string;
  }
  
  export interface Contenedor {
    id: number;
    capacidad: number;
    tipoResiduo: TipoResiduo;
    puntoRecogida: PuntoRecogida;
  }
  
  export interface PuntoRecogida {
    id: number;
    localidad: string;
    cp: number;
    provincia: string;
    direccion: string;
    tipo: string;
    propietario: {
      dni: string;
      nombre: string;
      telefono: number;
      email: string;
    };
  }
  
  export interface Recogida {
    id: number;
    fechaSolicitud: string;
    contenedor: Contenedor;
  }