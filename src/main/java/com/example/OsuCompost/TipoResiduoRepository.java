package com.example.OsuCompost;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoResiduoRepository extends JpaRepository<TipoResiduo, Integer> {
    // Métodos personalizados si es necesario
}

