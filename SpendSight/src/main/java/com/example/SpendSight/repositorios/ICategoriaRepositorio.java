
package com.example.SpendSight.Repositorios;


import java.util.List;
import java.util.Locale.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.SpendSight.Modelos.Categoria;

public interface ICategoriaRepositorio  extends JpaRepository<Categoria,Integer>{
    List<Categoria> findByNombre(String nombre) ;
    List<Categoria> findByDescripcion(String descripcion);
    List<Categoria> findByFechaCreacion(String fechaCreacion);
    List<Categoria> findByFechaModificacion(String fechaModificacion);
    List<Categoria> findByUsuarioCreacion(String usuarioCreacion);
    List<Categoria> findByTipo(String tipo);
}
