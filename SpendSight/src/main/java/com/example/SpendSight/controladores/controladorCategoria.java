package com.example.SpendSight.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpendSight.Modelos.Categoria;
import com.example.SpendSight.Modelos.Servicios.CategoriaServicio;


@RestController
@RequestMapping("apispendsight/v1/Categoria")
public class controladorCategoria {
    @Autowired
    CategoriaServicio categoria;
    public ResponseEntity<?>controladorGuardar(@RequestBody Categoria categorias){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.guardarComercio(categorias));
    }
    
    public ResponseEntity<?>controladorListar(){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.listarComercios());
    }



}
