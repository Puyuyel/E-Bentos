package com.ebentos.backend.model;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "CATEGORIA_EVENTO")
public class CategoriaEvento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CATEGORIA_EVENTO_ID")
    private Integer categoriaEventoId;
    
    @Column(name = "NOMBRE", length = 45, nullable = false)
    private String nombre;
}
