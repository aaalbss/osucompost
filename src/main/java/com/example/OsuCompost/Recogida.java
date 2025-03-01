package com.example.OsuCompost;

import java.util.Date;

import jakarta.persistence.*;

@Entity
@Table(name = "RECOGIDA")
public class Recogida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Date fechaSolicitud;
    private Date fechaRecogidaEstimada;
    private Date fechaRecogidaReal;
    private String incidencias;
    
    @ManyToOne
    @JoinColumn(name = "ID_CONTENEDOR")
    private Contenedor contenedor;

	/**
	 * @param id
	 * @param fechaSolicitud
	 * @param fechaRecogidaEstimada
	 * @param fechaRecogidaReal
	 * @param incidencias
	 * @param contenedor
	 */
	public Recogida(int id, Date fechaSolicitud, Date fechaRecogidaEstimada, Date fechaRecogidaReal, String incidencias,
			Contenedor contenedor) {
		super();
		this.id = id;
		this.fechaSolicitud = fechaSolicitud;
		this.fechaRecogidaEstimada = fechaRecogidaEstimada;
		this.fechaRecogidaReal = fechaRecogidaReal;
		this.incidencias = incidencias;
		this.contenedor = contenedor;
	}

	/**
	 * 
	 */
	public Recogida() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getFechaSolicitud() {
		return fechaSolicitud;
	}

	public void setFechaSolicitud(Date fechaSolicitud) {
		this.fechaSolicitud = fechaSolicitud;
	}

	public Date getFechaRecogidaEstimada() {
		return fechaRecogidaEstimada;
	}

	public void setFechaRecogidaEstimada(Date fechaRecogidaEstimada) {
		this.fechaRecogidaEstimada = fechaRecogidaEstimada;
	}

	public Date getFechaRecogidaReal() {
		return fechaRecogidaReal;
	}

	public void setFechaRecogidaReal(Date fechaRecogidaReal) {
		this.fechaRecogidaReal = fechaRecogidaReal;
	}

	public String getIncidencias() {
		return incidencias;
	}

	public void setIncidencias(String incidencias) {
		this.incidencias = incidencias;
	}

	public Contenedor getContenedor() {
		return contenedor;
	}

	public void setContenedor(Contenedor contenedor) {
		this.contenedor = contenedor;
	}
    
}
