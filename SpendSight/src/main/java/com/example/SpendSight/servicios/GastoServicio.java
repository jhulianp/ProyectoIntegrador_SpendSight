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
        if (datosGasto.getValor() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El valor debe ser mayor a cero");}
        if (datosGasto.getFecha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha no puede ser futura");}
        if (datosGasto.getMedioPago() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El medio de pago no puede estar vacio");}
        if (datosGasto.getCategoria() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoria no puede estar vacia");}
        //si la validacion es correcta, se guarda el gasto-------------------------------------------------------------
        return repositorio.save(datosGasto);
    }
    //funciona para listar todos los gastos----------------------------------------------------------------------------
    public List<Gasto> listarGastos() {
        return repositorio.findAll();
    }
    //servicio para eliminar un gasto en bd----------------------------------------------------------------------------
    public void eliminar_gasto(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gasto no encontrado");
        }
        repositorio.deleteById(id);
    }
    //servicio para modificar un gasto en bd---------------------------------------------------------------------------
    public Gasto modificar_gasto(Gasto gasto) {
        if (gasto.getId() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID del gasto es obligatorio para modificar");
        }
        return repositorio.save(gasto);
    }
    //servicio para buscar un gasto por id en bd-----------------------------------------------------------------------
    public Gasto buscar_gasto_por_id(Integer id) {
        return repositorio.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gasto no encontrado"));
    }
}