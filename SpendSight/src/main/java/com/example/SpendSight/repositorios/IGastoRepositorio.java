package com.example.SpendSight.Repositorios;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.SpendSight.Modelos.Gasto;
import com.example.SpendSight.Modelos.Comercio;
import com.example.SpendSight.Modelos.utils.EstadoGasto;
@Repository
public interface IGastoRepositorio extends JpaRepository<Gasto,Integer> {
    //considero una consulta personalizada POR AHORA COMO UNA BUSQUEDA
    //1. DEFINO QUE ATRIBUTOS TIENE MI MODELO Y SOLO SOBRE ESOS ATRIBUTOS PUEDO IMPLMENTAR LAS BUSQUEDAS
    List<Gasto> findByDescripcion(String descripcion);
    List<Gasto> findByFecha(LocalDate fecha);
    List<Gasto> findByValor(BigDecimal valor);
    Optional<Gasto> findByImagen(String imagen);
    List<Gasto> findByMedioPago(String medioPago);
    List<Gasto> findByCategoria(String categoria);
    List<Gasto> findByComercio(Comercio comercio);
    Optional<Gasto> findByEstado(EstadoGasto estado);
    Optional<Gasto> findByNotas(String notas);
};