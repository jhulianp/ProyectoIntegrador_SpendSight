package com.example.SpendSight.Controlador;

import com.example.SpendSight.Modelos.MedioPago;
import com.example.SpendSight.Servicio.MedioPagoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medios-pago")
public class MedioPagoControlador {

    @Autowired
    MedioPagoServicio medioPagoServicio;

    //funcion controladora para guardar un medio de pago
    @PostMapping
    public ResponseEntity<?> controladorGuardar(@RequestBody MedioPago datos){
        return ResponseEntity.status(HttpStatus.OK).body(
            medioPagoServicio.guardar_medioPago(datos)
        );
    }

    //funcion controladora para listar todos los medios de pago
    @GetMapping
    public ResponseEntity<List<MedioPago>> listar() {
        return ResponseEntity.ok(medioPagoServicio.listar_medioPago());
    }
}