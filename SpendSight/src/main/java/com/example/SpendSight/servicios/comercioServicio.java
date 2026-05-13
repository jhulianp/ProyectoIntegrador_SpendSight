
package com.example.SpendSight.servicios;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.SpendSight.Modelos.Comercio;

import com.example.SpendSight.repositorios.IcomercioRepositorio;


@Service
public class ComercioServicio {
    
    @Autowired
    private IcomercioRepositorio repositorio;

    public Comercio guardarComercio(Comercio datosComercio) {
        if (datosComercio.getNombre() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        if (datosComercio.getNit() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El NIT es obligatorio");
        }
        if (datosComercio.getActividad() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La actividad es obligatoria");
        }
        if (datosComercio.getContacto() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El contacto es obligatorio");
        }
        if (datosComercio.getDireccion() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La dirección es obligatoria");
        }
        if (datosComercio.getTelefono() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El teléfono es obligatorio");
        }
        if (datosComercio.getTipo() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo es obligatorio");
        }
        if (datosComercio.getGasto() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El gasto es obligatorio");
        }
        if (datosComercio.getPais() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El país es obligatorio");
        }

        
        return repositorio.save(datosComercio);    
    }

    public List<Comercio> listarComercios() {
        return repositorio.findAll();
    }

    public void eliminarComercio(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comercio no encontrado");
        }
        repositorio.deleteById(id);
    }
    public Comercio modificarComercio(Comercio comercio) {
        if (comercio.getId() == null || comercio.getId() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del comercio es obligatorio para modificar");
        }
        if (comercio.getNombre() == null || comercio.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del comercio es obligatorio");
        }
        return repositorio.save(comercio);
    }

    public Comercio buscarComercioPorId(Integer id) {
         return repositorio.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }
}
