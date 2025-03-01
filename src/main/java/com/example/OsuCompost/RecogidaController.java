package com.example.OsuCompost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recogidas")
public class RecogidaController {

    @Autowired
    private RecogidaRepository recogidaRepository;

    @GetMapping
    public List<Recogida> getAllRecogidas() {
        return recogidaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recogida> getRecogidaById(@PathVariable int id) {
        Optional<Recogida> recogida = recogidaRepository.findById(id);
        return recogida.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Recogida createRecogida(@RequestBody Recogida recogida) {
        return recogidaRepository.save(recogida);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recogida> updateRecogida(@PathVariable int id, @RequestBody Recogida recogida) {
        if (!recogidaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        recogida.setId(id);
        return ResponseEntity.ok(recogidaRepository.save(recogida));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecogida(@PathVariable int id) {
        if (!recogidaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        recogidaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
