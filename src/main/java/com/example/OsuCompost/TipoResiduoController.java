package com.example.OsuCompost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipos-residuos")
public class TipoResiduoController {

    @Autowired
    private TipoResiduoRepository tipoResiduoRepository;

    @GetMapping
    public List<TipoResiduo> getAllTiposResiduo() {
        return tipoResiduoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoResiduo> getTipoResiduoById(@PathVariable int id) {
        Optional<TipoResiduo> tipoResiduo = tipoResiduoRepository.findById(id);
        return tipoResiduo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public TipoResiduo createTipoResiduo(@RequestBody TipoResiduo tipoResiduo) {
        return tipoResiduoRepository.save(tipoResiduo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoResiduo> updateTipoResiduo(@PathVariable int id, @RequestBody TipoResiduo tipoResiduo) {
        if (!tipoResiduoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tipoResiduo.setId(id);
        return ResponseEntity.ok(tipoResiduoRepository.save(tipoResiduo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoResiduo(@PathVariable int id) {
        if (!tipoResiduoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tipoResiduoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
