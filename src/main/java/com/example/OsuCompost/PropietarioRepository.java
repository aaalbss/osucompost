package com.example.OsuCompost;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropietarioRepository extends JpaRepository<Propietario, String> {
    // Métodos personalizados si es necesario
}
