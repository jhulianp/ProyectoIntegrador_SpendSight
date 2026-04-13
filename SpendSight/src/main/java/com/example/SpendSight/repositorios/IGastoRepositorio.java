package com.example.SpendSight.repositorios;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.SpendSight.modelos.Gasto;
import com.example.SpendSight.modelos.utils.;
@Repository
public interface IGastoRepositorio extends JpaRepository<Gasto,Integer> {
    //considero una consulta personalizada POR AHORA COMO UNA BUSQUEDA
    //1. DEFINO QUE ATRIBUTOS TIENE MI MODELO Y SOLO SOBRE ESOS ATRIBUTOS PUEDO IMPLMENTAR LAS BUSQUEDAS
    List<Gasto> findByNombres(String descripcion);
    List<Gasto> findByTipoDocumento(LocalDate fecha);
    List<Gasto> findByDocumento(BigDecimal valor);
    List<Gasto> findByImagen(String imagen);
    List<Gasto> findByMedioPago(String medioPago);
    List<Gasto> findByCategoria(String categoria);
    List<Gasto> findByComercio(Comercio comercio);
    List<Gasto> findByEstado(EstadoGasto estado);
    List<Gasto> findByNotas(String notas);
};