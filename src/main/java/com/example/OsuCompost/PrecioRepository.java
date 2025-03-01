package com.example.OsuCompost;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrecioRepository extends JpaRepository<Precio, Integer> {
    // Métodos personalizados si es necesario
}
