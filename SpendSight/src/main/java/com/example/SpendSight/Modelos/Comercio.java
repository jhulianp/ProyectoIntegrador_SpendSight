package com.example.SpendSight.Modelos;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import com.example.SpendSight.Modelos.utils.TipoComercio;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

/**
 * id,nit,nombre,actividad,contacto(correo),telefono,direccion,ciudad,pais,tipo(comercio/servicio)
 */
@Entity
@Table(name = "comercios")
public class Comercio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "nit", nullable = false, length = 20)
    private String nit;
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    @Column(name = "actividad", nullable = true, length = 100)
    private String actividad;
    @Column(name = "contacto", nullable = true, length = 100)
    private String contacto;
    @Column(name = "telefono", nullable = true, length = 20)
    private String telefono;
    @Column(name = "direccion", nullable = true, length = 200)
    private String direccion;
    @Column(name = "ciudad", nullable = true, length = 50)
    private String ciudad;
    @Column(name = "pais", nullable = true, length = 50)
    private String pais;
    @Column(name = "tipo", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoComercio tipo;
    @ManyToOne
    @JoinColumn(name = "fk_gasto", referencedColumnName = "id")
    private Gasto gasto;

    public Comercio() {
    }

    public Comercio(Long id, String nit, String nombre, String actividad, String contacto,
                    String telefono, String direccion, String ciudad, String pais, TipoComercio tipo) {
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

    public TipoComercio getTipo() {
        return tipo;
    }

    public void setTipo(TipoComercio tipo) {
        this.tipo = tipo;
    }

    public Gasto getGasto() {
        return gasto;
    }

    public void setGasto(Gasto gasto) {
        this.gasto = gasto;
    }
}
