package com.example.OsuCompost;

import jakarta.persistence.*;

@Entity
@Table(name = "PUNTO_RECOGIDA")
public class PuntoRecogida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String localidad;
    private int cp;
    private String provincia;
    private String direccion;
    private String horario;
    private String tipo;
    
    @ManyToOne
    @JoinColumn(name = "DNI")
    private Propietario propietario;

	public PuntoRecogida(int id, String localidad, int cp, String provincia, String direccion, String horario,
			String tipo, Propietario propietario) {
		super();
		this.id = id;
		this.localidad = localidad;
		this.cp = cp;
		this.provincia = provincia;
		this.direccion = direccion;
		this.horario = horario;
		this.tipo = tipo;
		this.propietario = propietario;
	}

	/**
	 * 
	 */
	public PuntoRecogida() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getLocalidad() {
		return localidad;
	}

	public void setLocalidad(String localidad) {
		this.localidad = localidad;
	}

	public int getCp() {
		return cp;
	}

	public void setCp(int cp) {
		this.cp = cp;
	}

	public String getProvincia() {
		return provincia;
	}

	public void setProvincia(String provincia) {
		this.provincia = provincia;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getHorario() {
		return horario;
	}

	public void setHorario(String horario) {
		this.horario = horario;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public Propietario getPropietario() {
		return propietario;
	}

	public void setPropietario(Propietario propietario) {
		this.propietario = propietario;
	}
    
}
