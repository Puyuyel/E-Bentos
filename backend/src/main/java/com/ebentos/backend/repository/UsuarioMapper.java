package com.ebentos.backend.repository;

import com.ebentos.backend.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioMapper extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
}
