package com.example.SpendSight.controladores;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.SpendSight.Modelos.Comercio;
import com.example.SpendSight.Servicios.ComercioServicio;

@RestController
@RequestMapping("apispendsight/v1/")
public class controladorComercio {
    @Autowired
    ComercioServicio comercio;

    @PostMapping("comercios")
    public ResponseEntity<?>controladorGuardar(@RequestBody Comercio comercios){
        return ResponseEntity.status(HttpStatus.OK).body(comercio.guardarComercio(comercios));
    }
    
    @GetMapping("comercios")
    public ResponseEntity<?>controladorListar(){
        return ResponseEntity.status(HttpStatus.OK).body(comercio.listarComercios());
    }

}
