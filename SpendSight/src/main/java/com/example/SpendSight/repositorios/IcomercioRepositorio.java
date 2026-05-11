package com.example.SpendSight.Repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SpendSight.Modelos.Comercio;

@Repository
public interface IcomercioRepositorio extends JpaRepository<Comercio,Integer> {
    
 List<Comercio> findByNombre(String nombre);
 List<Comercio> findByNit(Number Nit);
 List<Comercio> findByActividad(String Actividad);
 List<Comercio> findByContacto(String Cantacto);
 List<Comercio> findByDireccion(String Direccion);
 List<Comercio> findByTelefono(String Telefono);
 List<Comercio> findByTipo(String Tipo);
 List<Comercio> findByGastoId(Number GastoId);
 List<Comercio> findByPais(String Pais);

}
