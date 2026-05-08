package com.example.SpendSight.controladores;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.SpendSight.Modelos.Categoria;
import com.example.SpendSight.servicios.CategoriaServicio;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;





@RestController
@RequestMapping("apispendsight/v1/Categoria")
public class controladorCategoria {
    @Autowired
    private CategoriaServicio categoriaServicio;
    
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategoria(){
        List<Categoria> categoria = categoriaServicio.listarCategoria();
        return ResponseEntity.ok(categoria);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscarCategoriaPorId(@PathVariable Integer id){
        Categoria categoria = categoriaServicio.buscarCategoriaPorId(id);
        return ResponseEntity.ok(categoria);
    }

    @PostMapping
    public ResponseEntity<Categoria>guardarCategoria(@RequestBody Categoria categoria) {
        Categoria categoriaGuardado = categoriaServicio.guardarCategoria(categoria);
        return ResponseEntity.ok(categoriaGuardado);
    }
    
    @PutMapping
    public ResponseEntity<Categoria>modificarCategoria(@RequestBody Categoria categoria) {
       Categoria categoriaModificada = categoriaServicio.modificarCategoria(categoria);
       return ResponseEntity.ok(categoriaModificada);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Integer id) {
        categoriaServicio.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
