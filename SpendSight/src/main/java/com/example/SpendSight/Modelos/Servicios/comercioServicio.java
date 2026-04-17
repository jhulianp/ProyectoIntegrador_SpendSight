package com.example.SpendSight.Modelos.Servicios;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.SpendSight.Modelos.Comercio;
import com.example.SpendSight.Modelos.repositorio.IcomercioRepositorio;
@Service
public class comercioServicio {
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

}
