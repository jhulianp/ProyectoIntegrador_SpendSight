package com.example.SpendSight.Servicios;

import com.example.SpendSight.Modelos.MedioPago;
import com.example.SpendSight.Repositorios.MedioPagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MedioPagoServicio {

    @Autowired
    private MedioPagoRepositorio repositorio;

    public MedioPago guardar_medioPago(MedioPago datosMedioPago){

        if(datosMedioPago.getNombre()==null || datosMedioPago.getNombre().isEmpty() || datosMedioPago.getNombre().isBlank()){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Apreciado usuario, el nombre del medio de pago es obligatorio"
            );

        }

        //validar que el nombre tenga al menos 3 caracteres
        if(datosMedioPago.getNombre().length()<3){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Apreciado usuario, el nombre debe tener mas de 3 caracteres"
            );

        }

        //Si paso todas las validaciones
        //intentare activar el guardado de los datos
        return repositorio.save(datosMedioPago);

    }

    //funcion para listar todos los medios de pago

    public List<MedioPago> listar_medioPago(){
        return repositorio.findAll();
    }
}