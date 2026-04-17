package com.example.SpendSight.servicios;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.SpendSight.Modelos.Gasto;
import com.example.SpendSight.repositorios.IGastoRepositorio;
@Service
public class GastoServicio {
    //Inyectando la dependencia al repositorio Gasto------------------------------------------------------------------
    @Autowired
    private IGastoRepositorio repositorio;
    //Se programa una funcion por cada servicio que voy a ofrecer-----------------------------------------------------
    //funcion para guardar un Gasto-----------------------------------------------------------------------------------
    public Gasto guardarGasto(Gasto datosGasto) {
        //validar la operacion que me estan pidiendo que hacer:-------------------------------------------------------
        if (datosGasto.getDescripcion() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La descripcion no puede estar vacia");}
        if (datosGasto.getValor() == null || datosGasto.getValor().length() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El valor debe ser mayor a cero");}
        if (datosGasto.getFecha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha no puede ser futura");}
        if (datosGasto.getMedioPago() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El medio de pago no puede estar vacio");}
        if (datosGasto.getCategoria() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoria no puede estar vacia");}
        if (datosGasto.getComercio() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El comercio no puede estar vacio");}
        if (datosGasto.getEstado() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El estado no puede estar vacio");}
        //si la validacion es correcta, se guarda el gasto-------------------------------------------------------------
        return repositorio.save(datosGasto);
    }
    //funciona para listar todos los gastos----------------------------------------------------------------------------
    public List<Gasto> listarGastos() {
        return repositorio.findAll();
    }

    //funcion para eliminar un Gasto----------------------------------------------------------------------------------
    public void eliminarGasto(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gasto no encontrado");
        }
        repositorio.deleteById(id);
    }

    //funcion para modificar un Gasto---------------------------------------------------------------------------------
    public Gasto modificarGasto(Gasto gasto) {
        if (gasto.getId() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID del gasto es obligatorio para modificar");
        }
        if (gasto.getDescripcion() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La descripcion no puede estar vacia");
        }
        if (gasto.getValor() == null || gasto.getValor().length() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El valor debe ser mayor a cero");
        }
        if (gasto.getFecha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha no puede ser futura");
        }
        if (gasto.getMedioPago() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El medio de pago no puede estar vacio");
        }
        if (gasto.getCategoria() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoria no puede estar vacia");
        }
        if (gasto.getComercio() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El comercio no puede estar vacio");
        }
        if (gasto.getEstado() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El estado no puede estar vacio");
        }
        return repositorio.save(gasto);
    }

    //funcion para buscar un Gasto por su id--------------------------------------------------------------------------
    public Gasto buscarGastoPorId(Integer id) {
        return repositorio.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gasto no encontrado"));
    }
}