import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

package com.example.SpendSight.Modelos;


@Entity
@Table(name = "medios_pago")
public class MedioPago {

    @Id
    private int id;
    private String nombre;
    private String franquicia;
    private String estado;
}
    public MedioPago() {
    }

    public MedioPago(int id, String nombre, String franquicia, String estado) {
        this.id = id;
        this.nombre = nombre;
        this.franquicia = franquicia;
        this.estado = estado;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFranquicia() {
        return franquicia;
    }

    public void setFranquicia(String franquicia) {
        this.franquicia = franquicia;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
