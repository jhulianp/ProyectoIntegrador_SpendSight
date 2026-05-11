package com.example.SpendSight.Servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.SpendSight.Modelos.Categoria;
import com.example.SpendSight.Repositorios.ICategoriaRepositorio;

@Service
public class CategoriaServicio {
    
    @Autowired
    private ICategoriaRepositorio repositorio;

    public Categoria guardCategoria(Categoria datosCategoria){
        if (datosCategoria.getNombre()==null) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getDescripcion()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getFechaCreacion()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getFechaModificacion()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getUsuarioCreacion()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getTipo()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        return repositorio.save(datosCategoria);
    }

    public List<Categoria> listarCategoria(){
        return repositorio.findAll();
    }
    public void eliminar_Categoria(Integer id) {
    if (!repositorio.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrado");
    }
        repositorio.deleteById(id);
    }

    public Categoria buscar_categoria_por_id(Integer id) {
        return repositorio.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "categoria no encontrado"));
    }
}
