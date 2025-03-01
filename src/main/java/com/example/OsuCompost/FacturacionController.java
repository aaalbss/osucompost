package com.example.OsuCompost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/facturaciones")
public class FacturacionController {

    @Autowired
    private FacturacionRepository facturacionRepository;

    @GetMapping
    public List<Facturacion> getAllFacturaciones() {
        return facturacionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facturacion> getFacturacionById(@PathVariable int id) {
        Optional<Facturacion> facturacion = facturacionRepository.findById(id);
        return facturacion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Facturacion createFacturacion(@RequestBody Facturacion facturacion) {
        return facturacionRepository.save(facturacion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facturacion> updateFacturacion(@PathVariable int id, @RequestBody Facturacion facturacion) {
        if (!facturacionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        facturacion.setId(id);
        return ResponseEntity.ok(facturacionRepository.save(facturacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacturacion(@PathVariable int id) {
        if (!facturacionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        facturacionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
