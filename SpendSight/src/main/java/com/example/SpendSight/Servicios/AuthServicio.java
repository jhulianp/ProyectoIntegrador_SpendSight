package com.example.SpendSight.Servicios;

import com.example.SpendSight.Modelos.Usuario;
import com.example.SpendSight.Modelos.utils.EstadoUsuario;
import com.example.SpendSight.Modelos.utils.TipoDocumento;
import com.example.SpendSight.Repositorios.IUsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Servicio de autenticación simple para SpendSight.
 * - Usa SHA-256 para hashear contraseñas (sin dependencias extra)
 * - No usa JWT: devuelve el Usuario y el front lo guarda en localStorage
 */
@Service
public class AuthServicio {

    @Autowired
    private IUsuarioRepositorio usuarioRepositorio;

    /** Hashea una contraseña usando SHA-256 + hex. */
    public String hashPassword(String password) {
        if (password == null) return null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo hashear la contraseña");
        }
    }

    /** Registra un nuevo usuario. Recibe payload con correo, password y demás datos básicos. */
    public Usuario registrar(Usuario datos, String passwordPlano) {
        if (datos.getCorreo() == null || datos.getCorreo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es obligatorio");
        }
        if (passwordPlano == null || passwordPlano.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 6 caracteres");
        }
        Optional<Usuario> existente = usuarioRepositorio.findByCorreo(datos.getCorreo());
        if (existente.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este correo ya está registrado");
        }

        // Rellenar valores por defecto requeridos por el esquema (nullable=false)
        if (datos.getId() == 0) {
            datos.setId(ThreadLocalRandom.current().nextInt(1, 2_000_000_000));
        }
        if (datos.getNombres() == null || datos.getNombres().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Los nombres son obligatorios");
        }
        if (datos.getTipoDocumento() == null) datos.setTipoDocumento(TipoDocumento.cedula);
        if (datos.getDocumento() == null || datos.getDocumento().isBlank()) {
            // En el registro vía login no exigimos documento real; generamos uno único derivado del correo
            datos.setDocumento("AUTO-" + Math.abs(datos.getCorreo().hashCode()));
        }
        if (datos.getEdad() == 0) datos.setEdad(18);
        if (datos.getTelefono() == null) datos.setTelefono("");
        if (datos.getDireccion() == null) datos.setDireccion("");
        if (datos.getCiudad() == null) datos.setCiudad("");
        if (datos.getPais() == null) datos.setPais("Colombia");
        if (datos.getEstado() == null) datos.setEstado(EstadoUsuario.Activo);

        datos.setPassword(hashPassword(passwordPlano));
        Usuario guardado = usuarioRepositorio.save(datos);
        guardado.setPassword(null); // no devolvemos el hash
        return guardado;
    }

    /** Valida credenciales y devuelve el Usuario (sin password) si son correctas. */
    public Usuario login(String correo, String passwordPlano) {
        if (correo == null || passwordPlano == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Correo y contraseña son obligatorios");
        }
        Usuario usuario = usuarioRepositorio.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        String hash = hashPassword(passwordPlano);
        if (usuario.getPassword() == null || !usuario.getPassword().equals(hash)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
        usuario.setPassword(null);
        return usuario;
    }
}
