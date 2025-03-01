package com.example.OsuCompost;

import jakarta.persistence.*;

@Entity
@Table(name = "CONTENEDORES")
public class Contenedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int capacidad;
    
    @ManyToOne
    @JoinColumn(name = "ID_TIPO_RESIDUO")
    private TipoResiduo tipoResiduo;
    
    @ManyToOne
    @JoinColumn(name = "ID_PUNTO_RECOGIDA")
    private PuntoRecogida puntoRecogida;

	/**
	 * @param id
	 * @param capacidad
	 * @param tipoResiduo
	 * @param puntoRecogida
	 */
	public Contenedor(int id, int capacidad, TipoResiduo tipoResiduo, PuntoRecogida puntoRecogida) {
		super();
		this.id = id;
		this.capacidad = capacidad;
		this.tipoResiduo = tipoResiduo;
		this.puntoRecogida = puntoRecogida;
	}

	/**
	 * 
	 */
	public Contenedor() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getCapacidad() {
		return capacidad;
	}

	public void setCapacidad(int capacidad) {
		this.capacidad = capacidad;
	}

	public TipoResiduo getTipoResiduo() {
		return tipoResiduo;
	}

	public void setTipoResiduo(TipoResiduo tipoResiduo) {
		this.tipoResiduo = tipoResiduo;
	}

	public PuntoRecogida getPuntoRecogida() {
		return puntoRecogida;
	}

	public void setPuntoRecogida(PuntoRecogida puntoRecogida) {
		this.puntoRecogida = puntoRecogida;
	}
    
}
