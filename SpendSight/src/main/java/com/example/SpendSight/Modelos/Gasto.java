import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import java.time.LocalDate;
import java.math.BigDecimal;

package com.example.SpendSight.Modelos;


@Entity
@table(name = "gastos")
public class Gasto {

    @Id
    private Long id;
    private String descripcion;
    private LocalDate fecha;
    private BigDecimal valor;
    private String imagen;
    private String medioPago;
    private String categoria;
    private Comercio comercio;

    private String estado;
    private String notas;
}
    public Gasto() {
    }

    public Gasto(Long id,
                 String descripcion,
                 LocalDate fecha,
                 BigDecimal valor,
                 String imagen,
                 String medioPago,
                 String categoria,
                 Comercio comercio,
                 String estado,
                 String notas) {
        this.id = id;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.valor = valor;
        this.imagen = imagen;
        this.medioPago = medioPago;
        this.categoria = categoria;
        this.comercio = comercio;
        this.estado = estado;
        this.notas = notas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getMedioPago() {
        return medioPago;
    }

    public void setMedioPago(String medioPago) {
        this.medioPago = medioPago;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Comercio getComercio() {
        return comercio;
    }

    public void setComercio(Comercio comercio) {
        this.comercio = comercio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
