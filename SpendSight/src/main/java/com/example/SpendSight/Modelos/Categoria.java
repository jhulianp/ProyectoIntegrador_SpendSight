package com.example.SpendSight.Modelos;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import com.example.SpendSight.Modelos.utils.EstadoCategoria;
import com.example.SpendSight.Modelos.utils.TipoCategoria;

//id, nombre, fechaCreacion, responsable, justificacion
@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    private int id;
    @Column(name = "nombre", nullable = false, length = 40)
    private String nombre;
    @Column(name = "descripcion", nullable = true, length = 255)
    private String descripcion;
    @Column(name = "icono", nullable = true, length = 100)
    private String icono;
    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoCategoria estado;
    @Column(name = "tipo", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoCategoria tipo;
    @Column(name = "fecha_creacion", nullable = false, length = 30)
    private String fechaCreacion;
    @Column(name = "fecha_modificacion", nullable = true, length = 20)
    private String fechaModificacion;
    @Column(name = "usuario_creacion", nullable = false, length = 50)
    private String usuarioCreacion;
    @Column(name = "usuario_modificacion", nullable = true, length = 50)
    private String usuarioModificacion;
    @ManyToOne
    @JoinColumn(name = "fk_gasto", referencedColumnName = "id")
    private Gasto gasto;

    public Categoria() {
    }

    public Categoria(int id, String nombre, String descripcion, String icono, EstadoCategoria estado, TipoCategoria tipo, String fechaCreacion, String fechaModificacion, String usuarioCreacion, String usuarioModificacion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.icono = icono;
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


    public EstadoCategoria getEstado() {
        return estado;
    }

    public void setEstado(EstadoCategoria estado) {
        this.estado = estado;
    }

    public TipoCategoria getTipo() {
        return tipo;
    }

    public void setTipo(TipoCategoria tipo) {
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

    public Gasto getGasto() {
        return gasto;
    }

    public void setGasto(Gasto gasto) {
        this.gasto = gasto;
    }
}