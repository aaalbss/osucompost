package com.example.OsuCompost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/precios")
public class PrecioController {

    @Autowired
    private PrecioRepository precioRepository;

    @GetMapping
    public List<Precio> getAllPrecios() {
        return precioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Precio> getPrecioById(@PathVariable int id) {
        Optional<Precio> precio = precioRepository.findById(id);
        return precio.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Precio createPrecio(@RequestBody Precio precio) {
        return precioRepository.save(precio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Precio> updatePrecio(@PathVariable int id, @RequestBody Precio precio) {
        if (!precioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        precio.setId(id);
        return ResponseEntity.ok(precioRepository.save(precio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrecio(@PathVariable int id) {
        if (!precioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        precioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
