package com.ebentos.backend.repository;

import com.ebentos.backend.model.Productora;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoraMapper extends JpaRepository<Productora, Integer> {
    List<Productora> findByRazonSocialStartingWith(String prefijo);
    Optional<Productora> findByEmail(String email);
}
