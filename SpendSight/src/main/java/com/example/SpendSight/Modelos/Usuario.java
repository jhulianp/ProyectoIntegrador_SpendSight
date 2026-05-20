package com.example.SpendSight.Modelos;
import com.example.SpendSight.Modelos.utils.TipoDocumento;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import com.example.SpendSight.Modelos.utils.EstadoUsuario;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    private int id;
    
    @Column(name = "nombres", nullable = false, unique = false, length = 50)
    private String nombres;
    @Column(name = "tipo_documento", nullable = false, unique = false)
    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;
    @Column(name = "documento", nullable = false, unique = true, length = 20)
    private String documento;
    @Column(name = "edad", nullable = false, unique = false, length = 3)
    private int edad;
    @Column(name = "correo", nullable = false, unique = true, length = 50)
    private String correo;
    @Column(name = "telefono", nullable = false, unique = false, length = 20)
    private String telefono;
    @Column(name = "direccion", nullable = false, unique = false, length = 100)
    private String direccion;
    @Column(name = "ciudad", nullable = false, unique = false, length = 50)
    private String ciudad;
    @Column(name = "pais", nullable = false, unique = false, length = 50)
    private String pais;
    @Column(name = "estado", nullable = false, unique = false)
    @Enumerated(EnumType.STRING)
    private EstadoUsuario estado;

    //Creando una relacion con el modelo de gasto

    //Yo como usuario me relaciono con muchos gastos
    @OneToMany(mappedBy = "usuario")
    private List<Gasto> gastos;

    //Yo como usuario me relaciono con muchos medios de pago
    @OneToMany(mappedBy = "usuario")
    private List<MedioPago> mediosPago;

    //Yo como usuario me relaciono con muchas categorías
    @OneToMany(mappedBy = "usuario")
    private List<Categoria> categorias;

    //Yo como usuario me relaciono con muchos comercios
    @OneToMany(mappedBy = "usuario")
    private List<Comercio> comercios;

    public Usuario() {
    }

    public Usuario(int id, String nombres, TipoDocumento tipoDocumento, String documento,
                int edad, String correo, String telefono,
                String direccion, String ciudad, String pais, EstadoUsuario estado) {
        this.id = id;
        this.nombres = nombres;
        this.tipoDocumento = tipoDocumento;
        this.documento = documento;
        this.edad = edad;
        this.correo = correo;
        this.telefono = telefono;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.pais = pais;
        this.estado = estado;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
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

    public EstadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(EstadoUsuario estado) {
        this.estado = estado;
    }
}