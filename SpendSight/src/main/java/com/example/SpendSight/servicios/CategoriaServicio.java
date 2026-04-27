package com.example.SpendSight.Modelos.Servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.SpendSight.Modelos.Categoria;
import com.example.SpendSight.Modelos.repositorio.ICategoriaRepositorio;
import com.example.SpendSight.Modelos.repositorio.IcomercioRepositorio;

@Service
public class CategoriaServicio {
    
    @Autowired
    private IcomercioRepositorio repositorio;

    public Categoria guardCategoria(Categoria datosCategoria){
        if (datosCategoria.getNombre()==null) {
         throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getDescripcion()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getFechaCreacion()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getFechaModificacion()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getUsuarioCreacion()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosCategoria.getTipo()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}


    }

    public list<Categoria> listarCategoria(){
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
