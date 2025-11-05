package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@SQLDelete(sql = "UPDATE puntoventa SET activo = 0 WHERE puntoventa_id = ?")
@Where(clause = "activo = 1")
@Entity
@Table(name = "PUNTOVENTA")
public class PuntoVenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PUNTOVENTA_ID")
    private Integer puntoventaId;
    
    @Column(name = "NOMBRE", nullable = false, length = 45)
    private String nombre;
    
    @Column(name = "DIRECCION", nullable = false, length = 45)
    private String direccion;
    
    @ManyToOne
    @JoinColumn(name = "DISTRITO_ID", nullable = false)
    private Distrito distrito;
    
    @Column(name = "ACTIVO", nullable = false, columnDefinition = "TINYINT")
    private Integer activo;
    
}
