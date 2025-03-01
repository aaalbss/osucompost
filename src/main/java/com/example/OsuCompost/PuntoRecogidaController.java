package com.example.OsuCompost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/puntos-recogida")
public class PuntoRecogidaController {

    @Autowired
    private PuntoRecogidaRepository puntoRecogidaRepository;

    @GetMapping
    public List<PuntoRecogida> getAllPuntosRecogida() {
        return puntoRecogidaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PuntoRecogida> getPuntoRecogidaById(@PathVariable int id) {
        Optional<PuntoRecogida> puntoRecogida = puntoRecogidaRepository.findById(id);
        return puntoRecogida.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PuntoRecogida createPuntoRecogida(@RequestBody PuntoRecogida puntoRecogida) {
        return puntoRecogidaRepository.save(puntoRecogida);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PuntoRecogida> updatePuntoRecogida(@PathVariable int id, @RequestBody PuntoRecogida puntoRecogida) {
        if (!puntoRecogidaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        puntoRecogida.setId(id);
        return ResponseEntity.ok(puntoRecogidaRepository.save(puntoRecogida));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePuntoRecogida(@PathVariable int id) {
        if (!puntoRecogidaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        puntoRecogidaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
