package com.example.SpendSight.Modelos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.LocalDate;
import java.math.BigDecimal;
import com.example.SpendSight.Modelos.utils.EstadoGasto;
import java.util.List;

@Entity
@Table(name = "gastos")
public class Gasto {

    @Id
    private Long id;

    @Column(name = "descripcion", nullable = false, unique = false, length = 100)
    private String descripcion;
    @Column(name = "fecha", nullable = false, unique = false)
    private LocalDate fecha;
    @Column(name = "valor", nullable = false, unique = false, precision = 10, scale = 2)
    private BigDecimal valor;
    @Column(name = "imagen", nullable = true, unique = false, length = 255)
    private String imagen;
    @Column(name = "medio_pago", nullable = false, unique = false, length = 50)
    private String medioPago;
    @Column(name = "categoria", nullable = false, unique = false, length = 50)
    private String categoria;
    @Column(name = "comercio", nullable = false, unique = false, length = 50)
    private Comercio comercio;

    //yo como gasto me relaciono con 1 usuario
    @ManyToOne
    @JoinColumn(name = "fk_usuario", referencedColumnName = "id")
    private Usuario usuario;
    @ManyToOne
    @JoinColumn(name = "fk_categoria", referencedColumnName = "id")
    private Categoria categoria1;
    @OneToMany(mappedBy = "gasto")
    private List<Comercio> comercios;

    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoGasto estado;
    @Column(name = "notas", nullable = true, length = 255)
    private String notas;

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
                EstadoGasto estado,
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

    public EstadoGasto getEstado() {
        return estado;
    }

    public void setEstado(EstadoGasto estado) {
        this.estado = estado;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
}