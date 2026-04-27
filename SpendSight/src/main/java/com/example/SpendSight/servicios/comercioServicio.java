package com.example.SpendSight.Modelos.Servicios;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.SpendSight.Modelos.Comercio;
import com.example.SpendSight.Modelos.repositorio.IcomercioRepositorio;
@Service
public class ComercioServicio {
    @Autowired
    private IcomercioRepositorio repositorio;

    public Comercio guardarComercio(Comercio datosComercio){
        if (datosComercio.getNombre()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"El nombre debe ser obligatorio");}
        if(datosComercio.getNit()==null){
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"El Nit, es obligatorio");}
        if (datosComercio.getActividad()==null) {
           throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio"); }
        if (datosComercio.getContacto()==null) {
          throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosComercio.getDireccion()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosComercio.getTelefono()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosComercio.getTipo()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosComercio.getGasto()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        if (datosComercio.getPais()==null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST,"llenar todo, es obligatorio");}
        
        return repositorio.save(datosComercio);    

    }
        public List<Comercio> listarComercios() {
        return repositorio.findAll();
    }
        public void eliminar_Comercio(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comercio no encontrado");
        }
        repositorio.deleteById(id);
    }

    public Comercio buscar_comercio_por_id(Integer id) {
        return repositorio.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "comercio no encontrado"));
    }
}
