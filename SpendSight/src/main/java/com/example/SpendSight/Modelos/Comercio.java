import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

package com.example.SpendSight.Modelos;


/**
 * id,nit,nombre,actividad,contacto(correo),telefono,direccion,ciudad,pais,tipo(comercio/servicio)
 */
@Entity
@Table(name = "comercios")
public class Comercio {

    @Id
    private Long id;
    private String nit;
    private String nombre;
    private String actividad;
    private String contacto;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String pais;
    private String tipo;
}
    public Comercio() {
    }

    public Comercio(Long id, String nit, String nombre, String actividad, String contacto,
                    String telefono, String direccion, String ciudad, String pais, String tipo) {
        this.id = id;
        this.nit = nit;
        this.nombre = nombre;
        this.actividad = actividad;
        this.contacto = contacto;
        this.telefono = telefono;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.pais = pais;
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getActividad() {
        return actividad;
    }

    public void setActividad(String actividad) {
        this.actividad = actividad;
    }

    public String getContacto() {
        return contacto;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
