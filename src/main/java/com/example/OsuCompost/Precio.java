package com.example.OsuCompost;

import java.util.Date;

import jakarta.persistence.*;

@Entity
@Table(name = "PRECIO")
public class Precio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Date fechaInicio;
    private Date fechaFin;
    private float valor;
    
    @ManyToOne
    @JoinColumn(name = "ID_TIPO_RESIDUO")
    private TipoResiduo tipoResiduo;

	/**
	 * @param id
	 * @param fechaInicio
	 * @param fechaFin
	 * @param valor
	 * @param tipoResiduo
	 */
	public Precio(int id, Date fechaInicio, Date fechaFin, float valor, TipoResiduo tipoResiduo) {
		super();
		this.id = id;
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechaFin;
		this.valor = valor;
		this.tipoResiduo = tipoResiduo;
	}

	/**
	 * 
	 */
	public Precio() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(Date fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public Date getFechaFin() {
		return fechaFin;
	}

	public void setFechaFin(Date fechaFin) {
		this.fechaFin = fechaFin;
	}

	public float getValor() {
		return valor;
	}

	public void setValor(float valor) {
		this.valor = valor;
	}

	public TipoResiduo getTipoResiduo() {
		return tipoResiduo;
	}

	public void setTipoResiduo(TipoResiduo tipoResiduo) {
		this.tipoResiduo = tipoResiduo;
	}
    
}