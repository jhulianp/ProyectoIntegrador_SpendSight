package com.example.SpendSight.repositorios;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SpendSight.Modelos.Usuario;

@Repository
public interface IUsuarioRepositorio extends JpaRepository<Usuario, Integer> {
    
    //definirque atributos tiene mi modelo y solo sobre esos atributos puedo implementar las busquedas
    
    //buscar por nombre
     List<Usuario> findByNombres(String nombres);
     //buscar por tipo de documento
     List<Usuario> findByTipoDocumento(String tipoDocumento);
     //buscar por documento
     Optional<Usuario> findByDocumento(String documento);
     //buscar por edad
     List<Usuario> findByEdad(Integer edad);
     //buscar por correo
     Optional<Usuario> findByCorreo(String correo);
     //buscar por telefono
     List<Usuario> findByTelefono(String telefono);
     //buscar por ciudad
     List<Usuario> findByCiudad(String ciudad);
     //buscar por pais
     List<Usuario> findByPais(String pais);
     //buscar por estado
     List<Usuario> findByEstado(String estado);
}
