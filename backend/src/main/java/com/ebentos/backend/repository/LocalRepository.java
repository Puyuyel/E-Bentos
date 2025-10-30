package com.ebentos.backend.repository;

import com.ebentos.backend.model.Local;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalRepository extends JpaRepository<Local, Integer>{
    
}
