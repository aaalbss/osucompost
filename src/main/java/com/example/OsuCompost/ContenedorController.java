package com.example.OsuCompost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contenedores")
public class ContenedorController {

    @Autowired
    private ContenedorRepository contenedorRepository;

    @GetMapping
    public List<Contenedor> getAllContenedores() {
        return contenedorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contenedor> getContenedorById(@PathVariable int id) {
        Optional<Contenedor> contenedor = contenedorRepository.findById(id);
        return contenedor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Contenedor createContenedor(@RequestBody Contenedor contenedor) {
        return contenedorRepository.save(contenedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contenedor> updateContenedor(@PathVariable int id, @RequestBody Contenedor contenedor) {
        if (!contenedorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contenedor.setId(id);
        return ResponseEntity.ok(contenedorRepository.save(contenedor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContenedor(@PathVariable int id) {
        if (!contenedorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contenedorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
