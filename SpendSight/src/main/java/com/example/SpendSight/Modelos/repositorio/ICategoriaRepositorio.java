package com.example.SpendSight.Modelos.repositorio;

import java.util.List;
import java.util.Locale.Category;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.SpendSight.Modelos.Categoria;

public interface ICategoriaRepositorio  extends JpaRepository<Category,Integer>{
    List<Categoria> findByNombre() ;
    List<Categoria> findByDescripcion();
    List<Categoria> findByFechaCreacion();
    List<Categoria> findByFechaModificacion();
    List<Categoria> findByUsuarioCreacion();
 
    List<Categoria> findByTipo();
}
