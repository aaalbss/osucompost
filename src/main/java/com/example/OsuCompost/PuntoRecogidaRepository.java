package com.example.OsuCompost;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuntoRecogidaRepository extends JpaRepository<PuntoRecogida, Integer> {
    // Métodos personalizados si es necesario
}
