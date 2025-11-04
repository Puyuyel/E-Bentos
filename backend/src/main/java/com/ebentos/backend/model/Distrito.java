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
@Table(name = "DISTRITO")
public class Distrito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DISTRITO_ID")
    private Integer distritoId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;
    
    @ManyToOne
    @JoinColumn(name = "PROVINCIA_ID", nullable = false)
    private Provincia provincia;
    
}
