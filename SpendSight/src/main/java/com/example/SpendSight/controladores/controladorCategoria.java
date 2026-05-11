package com.example.SpendSight.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpendSight.Modelos.Categoria;
import com.example.SpendSight.Servicios.CategoriaServicio;

@RestController
@RequestMapping("/apispendsight/v1/categorias")
public class controladorCategoria {
    @Autowired
    private CategoriaServicio categoriaServicio;

    @PostMapping
    public ResponseEntity<?> controladorGuardar(@RequestBody Categoria categorias){
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaServicio.guardCategoria(categorias));
    }
    
    @GetMapping
    public ResponseEntity<?> controladorListar(){
        return ResponseEntity.status(HttpStatus.OK).body(categoriaServicio.listarCategoria());
    }
}
