package com.example.OsuCompost;

import jakarta.persistence.*;

@Entity
@Table(name = "TIPO_RESIDUO")
public class TipoResiduo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String descripcion;
	/**
	 * @param id
	 * @param descripcion
	 */
	public TipoResiduo(int id, String descripcion) {
		super();
		this.id = id;
		this.descripcion = descripcion;
	}
	/**
	 * 
	 */
	public TipoResiduo() {
		super();
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
    
}