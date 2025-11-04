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
@Table(name = "PROVINCIA")
public class Provincia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROVINCIA_ID")
    private Integer provinciaId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;
    
    @ManyToOne
    @JoinColumn(name = "DEPARTAMENTO_ID", nullable = false)
    private Departamento departamento;
    
}
