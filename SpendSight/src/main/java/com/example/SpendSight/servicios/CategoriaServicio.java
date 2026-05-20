
package com.example.SpendSight.Servicios;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.SpendSight.Modelos.Categoria;

import com.example.SpendSight.Repositorios.ICategoriaRepositorio;
import com.example.SpendSight.Repositorios.IcomercioRepositorio;


@Service
public class CategoriaServicio {
    
    @Autowired
    private ICategoriaRepositorio repositorio;


    public Categoria guardarCategoria(Categoria datosCategoria) {
        if (datosCategoria.getNombre() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        if (datosCategoria.getDescripcion() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La descripción es obligatoria");
        }
        if (datosCategoria.getFechaCreacion() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de creación es obligatoria");
        }
        if (datosCategoria.getFechaModificacion() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de modificación es obligatoria");
        }
        if (datosCategoria.getUsuarioCreacion() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario de creación es obligatorio");
        }
        if (datosCategoria.getTipo() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo es obligatorio");
        }

        return repositorio.save(datosCategoria);
    }

    public List<Categoria> listarCategoria() {

        return repositorio.findAll();
    }

    public void eliminarCategoria(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }
        repositorio.deleteById(id);
    }

    public Categoria modificarCategoria(Categoria categoria){
        if(categoria.getId()==0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"ID del  usuario para modificar");
        }
        if (categoria.getNombre()==null || categoria.getNombre().isBlank()  || categoria.getNombre().isEmpty() ) {
            throw new  ResponseStatusException(HttpStatus.BAD_REQUEST,"El nombre del usuario es obligatoria");
        }
        return repositorio.save(categoria);
    }

    public Categoria buscarCategoriaPorId(Integer id) {
        return repositorio.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }
}
