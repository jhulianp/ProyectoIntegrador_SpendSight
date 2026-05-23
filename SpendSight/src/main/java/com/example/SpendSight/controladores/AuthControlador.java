package com.example.SpendSight.controladores;

import com.example.SpendSight.Modelos.Usuario;
import com.example.SpendSight.Servicios.AuthServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador de autenticación.
 * Endpoints:
 *   POST /api/auth/register  -> { ...campos Usuario..., password: "plano" }
 *   POST /api/auth/login     -> { correo, password }
 *
 * Ambos devuelven el Usuario sin el campo password.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    @Autowired
    private AuthServicio authServicio;

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrar(@RequestBody Map<String, Object> body) {
        Usuario u = mapearUsuarioDesdeBody(body);
        String password = (String) body.getOrDefault("password", null);
        Usuario creado = authServicio.registrar(u, password);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> body) {
        Usuario u = authServicio.login(body.get("correo"), body.get("password"));
        return ResponseEntity.ok(u);
    }

    @SuppressWarnings("unchecked")
    private Usuario mapearUsuarioDesdeBody(Map<String, Object> body) {
        Usuario u = new Usuario();
        if (body.get("id") != null)         u.setId(((Number) body.get("id")).intValue());
        if (body.get("nombres") != null)    u.setNombres((String) body.get("nombres"));
        if (body.get("documento") != null)  u.setDocumento((String) body.get("documento"));
        if (body.get("edad") != null)       u.setEdad(((Number) body.get("edad")).intValue());
        if (body.get("correo") != null)     u.setCorreo((String) body.get("correo"));
        if (body.get("telefono") != null)   u.setTelefono((String) body.get("telefono"));
        if (body.get("direccion") != null)  u.setDireccion((String) body.get("direccion"));
        if (body.get("ciudad") != null)     u.setCiudad((String) body.get("ciudad"));
        if (body.get("pais") != null)       u.setPais((String) body.get("pais"));
        if (body.get("tipoDocumento") != null) {
            try {
                u.setTipoDocumento(com.example.SpendSight.Modelos.utils.TipoDocumento.valueOf((String) body.get("tipoDocumento")));
            } catch (Exception ignored) { /* default lo setea el servicio */ }
        }
        if (body.get("estado") != null) {
            try {
                u.setEstado(com.example.SpendSight.Modelos.utils.EstadoUsuario.valueOf((String) body.get("estado")));
            } catch (Exception ignored) { /* default lo setea el servicio */ }
        }
        return u;
    }
}
