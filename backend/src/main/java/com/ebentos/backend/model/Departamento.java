package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "DEPARTAMENTO")
public class Departamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    @Column(name = "DEPARTAMENTO_ID")
    private Integer departamentoId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;
    
}
