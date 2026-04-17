package com.example.SpendSight.Gasto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.SpendSight.repositorios.IUsuarioRepositorio;
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
}