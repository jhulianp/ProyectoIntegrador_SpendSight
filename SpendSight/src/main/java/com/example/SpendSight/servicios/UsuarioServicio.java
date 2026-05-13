package com.example.SpendSight.Servicios;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.SpendSight.Modelos.Usuario;
import com.example.SpendSight.Repositorios.IUsuarioRepositorio;

@Service
public class UsuarioServicio {

    @Autowired
    private IUsuarioRepositorio repositorio;

    //servicio para guardar un usuario
    public Usuario guardar_usuario(Usuario datosUsuario){

        //validar la operacion que me estan pidiendo hacer
        if(datosUsuario.getNombres()==null || datosUsuario.getNombres().isBlank() || datosUsuario.getNombres().isEmpty()){

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre del usuario es obligatorio, revisa por favor"
            );

        }

        if(datosUsuario.getDocumento().length()<5){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "el documento es invalido"
            );
        }

        //Despues de las validaciones intento guardar los datos que me enviaron
        return repositorio.save(datosUsuario);
        
    }

    //servicio para listar todos los usuarios en BD

    public List<Usuario> listar_usuarios(){
        return repositorio.findAll();
    }


    //servicio para eliminar un usuario en bd
    public void eliminar_usuario(Integer id) {
        if (!repositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        repositorio.deleteById(id);
    }

    //servicio para modificar un usuario en bd
    public Usuario modificar_usuario(Usuario usuario) {
        if (usuario.getId() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID del usuario es obligatorio para modificar");
        }
        if (usuario.getNombres() == null || usuario.getNombres().isBlank() || usuario.getNombres().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del usuario es obligatorio");
        }
        if (usuario.getDocumento().length() < 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El documento es inválido");
        }
        return repositorio.save(usuario);
    }

    //servicio para buscar un usuario por su id
    public Usuario buscar_usuario_por_id(Integer id) {
        return repositorio.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }


}
