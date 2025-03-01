package com.example.OsuCompost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/propietarios")
public class PropietarioController {

    @Autowired
    private PropietarioRepository propietarioRepository;

    @GetMapping
    public List<Propietario> getAllPropietarios() {
        return propietarioRepository.findAll();
    }

    @GetMapping("/{dni}")
    public ResponseEntity<Propietario> getPropietarioById(@PathVariable String dni) {
        Optional<Propietario> propietario = propietarioRepository.findById(dni);
        return propietario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Propietario createPropietario(@RequestBody Propietario propietario) {
        return propietarioRepository.save(propietario);
    }

    @PutMapping("/{dni}")
    public ResponseEntity<Propietario> updatePropietario(@PathVariable String dni, @RequestBody Propietario propietario) {
        if (!propietarioRepository.existsById(dni)) {
            return ResponseEntity.notFound().build();
        }
        propietario.setDni(dni);
        return ResponseEntity.ok(propietarioRepository.save(propietario));
    }

    @DeleteMapping("/{dni}")
    public ResponseEntity<Void> deletePropietario(@PathVariable String dni) {
        if (!propietarioRepository.existsById(dni)) {
            return ResponseEntity.notFound().build();
        }
        propietarioRepository.deleteById(dni);
        return ResponseEntity.noContent().build();
    }
}
