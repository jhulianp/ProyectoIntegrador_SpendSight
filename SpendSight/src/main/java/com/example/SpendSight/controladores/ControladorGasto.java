package com.example.SpendSight.controladores;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.SpendSight.Modelos.Gasto;
import com.example.SpendSight.servicios.GastoServicio;  


@RestController
@RequestMapping("apispendsight/v1/gastos")
public class ControladorGasto {
    @Autowired
    GastoServicio servicio;

    //por cada servicio progra,o un metodo para recibir y enviar respuestas al cliente 

    //funcion comtroladora para guardar un gasto
    public ResponseEntity<?>controladorGuardar(@RequestBody Gasto gastos){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.guardarGasto(gastos));
    } 

    //funcion controladora para listar todos los gastos
    public ResponseEntity<?>controladorListar(){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.listarGastos());
    }


}
