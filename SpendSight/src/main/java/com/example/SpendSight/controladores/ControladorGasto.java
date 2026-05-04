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

    //por cada servicio programamsos un metodo para recibir y enviar respuestas al cliente 

    //funcion comtroladora para guardar un gasto
    @PostMapping
    public ResponseEntity<?>controladorGuardar(@RequestBody Gasto gastos){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.guardarGasto(gastos));
    } 

    //funcion controladora para listar todos los gastos
    @GetMapping
    public ResponseEntity<?>controladorListar(){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.listarGastos());
    }

    //controlador para modificar un gasto
    @PutMapping("/{id}")
    public ResponseEntity<?>controladorModificar(@PathVariable Integer id, @RequestBody Gasto datosNuevos){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.modificar_gasto(id, datosNuevos));   
    }


    //controlador para eliminar un gasto
    @DeleteMapping("/{id}")
    public ResponseEntity<?>controladorEliminar(@PathVariable Integer id){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.eliminar_gasto(id));   
    }

    //controlador para buscar un gasto por id
    @GetMapping("/{id}")
    public ResponseEntity<?>controladorBuscarPorId(@PathVariable Integer id){
        return ResponseEntity.status(HttpStatus.OK).body(servicio.buscar_gasto_por_id(id));   
    }

}
