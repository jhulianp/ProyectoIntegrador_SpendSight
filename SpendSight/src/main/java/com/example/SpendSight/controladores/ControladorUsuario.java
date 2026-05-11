package com.example.SpendSight.controladores;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpendSight.Modelos.Usuario;
import com.example.SpendSight.Servicios.UsuarioServicio;

@RestController
@RequestMapping("/api/usuarios")
public class ControladorUsuario {

    @Autowired
    private UsuarioServicio usuarioServicio;

    // Endpoint para listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioServicio.listar_usuarios();
        return ResponseEntity.ok(usuarios);
    }

    // Endpoint para buscar un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable Integer id) {
        Usuario usuario = usuarioServicio.buscar_usuario_por_id(id);
        return ResponseEntity.ok(usuario);
    }

    // Endpoint para guardar un nuevo usuario
    @PostMapping
    public ResponseEntity<Usuario> guardarUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioGuardado = usuarioServicio.guardar_usuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
    }

    // Endpoint para modificar un usuario existente
    @PutMapping
    public ResponseEntity<Usuario> modificarUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioModificado = usuarioServicio.modificar_usuario(usuario);
        return ResponseEntity.ok(usuarioModificado);
    }

    // Endpoint para eliminar un usuario por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        usuarioServicio.eliminar_usuario(id);
        return ResponseEntity.noContent().build();
    }
}