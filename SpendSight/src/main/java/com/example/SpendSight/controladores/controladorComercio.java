package com.example.SpendSight.controladores;

import java.util.List;

import org.apache.catalina.connector.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpendSight.Modelos.Comercio;
import com.example.SpendSight.servicios.ComercioServicio;

@RestController
@RequestMapping("apispendsight/v1/Comercio")
public class controladorComercio {
    @Autowired
    private ComercioServicio comercioServicio;

    @GetMapping
    public ResponseEntity<List<Comercio>> listarComercios(){
        List<Comercio> comercios = comercioServicio.listarComercios();
        return ResponseEntity.ok(comercios);
    }
    
     @GetMapping("/{id}")
    public ResponseEntity<Comercio> buscarComercioPorId(@PathVariable Integer id){
        Comercio comercios = comercioServicio.buscarComercioPorId(id);
        return ResponseEntity.ok(comercios);
    }

    @PostMapping
    public ResponseEntity<Comercio>guardarComercio(@RequestBody Comercio comercio) {
        Comercio comercioGuardado = comercioServicio.guardarComercio(comercio);
        return ResponseEntity.ok(comercioGuardado);
    }

    @PutMapping
    public ResponseEntity<Comercio>modificarComercio(@RequestBody Comercio comercio) {
      Comercio categoriaModificada = comercioServicio.modificarComercio(comercio);
       return ResponseEntity.ok(categoriaModificada);
    }

        @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComercio(@PathVariable Integer id) {
        comercioServicio.eliminarComercio(id);
        return ResponseEntity.noContent().build();
    }

}
