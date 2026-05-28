package com.example.SpendSight.Servicios;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.SpendSight.Modelos.Gasto;
import com.example.SpendSight.Repositorios.IGastoRepositorio;
import com.example.SpendSight.Repositorios.IUsuarioRepositorio;
import java.util.Optional;
@Service
public class GastoServicio {
    //Inyectando la dependencia al repositorio Gasto------------------------------------------------------------------
    @Autowired
    private IGastoRepositorio repositorio;

    @Autowired
    private IUsuarioRepositorio usuarioRepositorio;

    //Se programa una funcion por cada servicio que voy a ofrecer-----------------------------------------------------
    //funcion para guardar un Gasto-----------------------------------------------------------------------------------
    public Gasto guardarGasto(Gasto datosGasto) {
        // Forzamos el ID a null para asegurar la creación de un nuevo registro
        datosGasto.setId(null);

        //validar la operacion que me estan pidiendo que hacer:-------------------------------------------------------
        if (datosGasto.getDescripcion() == null || datosGasto.getDescripcion().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La descripcion no puede estar vacia");}
        if (datosGasto.getValor() == null || datosGasto.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El valor debe ser mayor a cero");}
        if (datosGasto.getFecha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha no puede ser futura");}

        // Validar que el usuario asociado exista en la BD para evitar errores de integridad referencial
        if (datosGasto.getUsuario() == null || datosGasto.getUsuario().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El gasto debe estar asociado a un usuario válido");
        }
        if (!usuarioRepositorio.existsById(datosGasto.getUsuario().getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado. Por favor, inicie sesión de nuevo.");
        }

        //si la validacion es correcta, se guarda el gasto-------------------------------------------------------------
        return repositorio.save(datosGasto);
    }

    //funcion para listar todos los gastos----------------------------------------------------------------------------
    public List<Gasto> listarGastos() {
        return repositorio.findAll();
    }
    //funcion para modificar un gasto en bd---------------------------------------------------------------------------
    public Gasto modificar_gasto(Integer id, Gasto datosNuevos) {
        Optional<Gasto> gasto_buscado = repositorio.findById(id);
        if (gasto_buscado.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gasto no encontrado");
        }else{
            Gasto gasto_encontrado = gasto_buscado.get();
            //modifiquemos datos 
            gasto_encontrado.setDescripcion(datosNuevos.getDescripcion());
            gasto_encontrado.setValor(datosNuevos.getValor());
            gasto_encontrado.setFecha(datosNuevos.getFecha());
            gasto_encontrado.setMedioPago(datosNuevos.getMedioPago());
            gasto_encontrado.setCategoria(datosNuevos.getCategoria());
            gasto_encontrado.setComercio(datosNuevos.getComercio());
            gasto_encontrado.setEstado(datosNuevos.getEstado());
            gasto_encontrado.setNotas(datosNuevos.getNotas());
            return repositorio.save(gasto_encontrado);
        }
    }

    //servicio para eliminar un gasto en bd----------------------------------------------------------------------------
    public boolean eliminar_gasto(Integer id) {
        Optional<Gasto> gasto_buscado = repositorio.findById(id);
        if (gasto_buscado.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gasto no encontrado");
        }else{
            repositorio.deleteById(id);
            return true;
        }
        
    }

    //servicio para buscar un gasto por id en bd-----------------------------------------------------------------------
    public Gasto buscar_gasto_por_id(Integer id) {
        Optional<Gasto> gasto_buscado = repositorio.findById(id);
        if (gasto_buscado.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gasto no encontrado");
        }else{
            return gasto_buscado.get();
        }
    }
}