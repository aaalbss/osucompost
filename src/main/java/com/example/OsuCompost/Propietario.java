package com.example.OsuCompost;

import jakarta.persistence.*;
import java.util.List;
import java.util.Date;

@Entity
@Table(name = "PROPIETARIO")
public class Propietario {
    @Id
    private String dni;
    private String nombre;
    private int telefono;
    private String email;
	/**
	 * @param dni
	 * @param nombre
	 * @param telefono
	 * @param email
	 */
	public Propietario(String dni, String nombre, int telefono, String email) {
		super();
		this.dni = dni;
		this.nombre = nombre;
		this.telefono = telefono;
		this.email = email;
	}
	public Propietario() {
		super();
	}
	public String getDni() {
		return dni;
	}
	public void setDni(String dni) {
		this.dni = dni;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public int getTelefono() {
		return telefono;
	}
	public void setTelefono(int telefono) {
		this.telefono = telefono;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
    
}