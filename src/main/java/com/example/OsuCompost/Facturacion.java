package com.example.OsuCompost;

import jakarta.persistence.*;

@Entity
@Table(name = "FACTURACION")
public class Facturacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private float total;
    
    @ManyToOne
    @JoinColumn(name = "DNI")
    private Propietario propietario;
    
    @ManyToOne
    @JoinColumn(name = "ID_TIPO_RESIDUO")
    private TipoResiduo tipoResiduo;

	/**
	 * @param id
	 * @param total
	 * @param propietario
	 * @param tipoResiduo
	 */
	public Facturacion(int id, float total, Propietario propietario, TipoResiduo tipoResiduo) {
		super();
		this.id = id;
		this.total = total;
		this.propietario = propietario;
		this.tipoResiduo = tipoResiduo;
	}

	/**
	 * 
	 */
	public Facturacion() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	public Propietario getPropietario() {
		return propietario;
	}

	public void setPropietario(Propietario propietario) {
		this.propietario = propietario;
	}

	public TipoResiduo getTipoResiduo() {
		return tipoResiduo;
	}

	public void setTipoResiduo(TipoResiduo tipoResiduo) {
		this.tipoResiduo = tipoResiduo;
	}
    
}