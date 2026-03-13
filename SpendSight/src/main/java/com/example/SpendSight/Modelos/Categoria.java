import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

package com.example.SpendSight.Modelos;
//id, nombre, fechaCreacion, responsable, justificacion
@ManyToMany(mappedBy = "categorias")
private Set<Comercio> comercios = new HashSet<>();
@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    private int id;
    private String nombre;
    private String icono;
    private String color;
    private String estado;
    private String tipo;
    private String fechaCreacion;
    private String fechaModificacion;
    private String usuarioCreacion;
    private String usuarioModificacion;
}
    public Categoria() {
    }

    public Categoria(int id, String nombre, String descripcion, String icono, String color, String estado, String tipo, String fechaCreacion, String fechaModificacion, String usuarioCreacion, String usuarioModificacion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.icono = icono;
        this.color = color;
        this.estado = estado;
        this.tipo = tipo;
        this.fechaCreacion = fechaCreacion;
        this.fechaModificacion = fechaModificacion;
        this.usuarioCreacion = usuarioCreacion;
        this.usuarioModificacion = usuarioModificacion;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(String fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(String fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public String getUsuarioCreacion() {
        return usuarioCreacion;
    }

    public void setUsuarioCreacion(String usuarioCreacion) {
        this.usuarioCreacion = usuarioCreacion;
    }

    public String getUsuarioModificacion() {
        return usuarioModificacion;
    }

    public void setUsuarioModificacion(String usuarioModificacion) {
        this.usuarioModificacion = usuarioModificacion;
    }
