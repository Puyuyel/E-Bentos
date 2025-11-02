package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "PUNTOVENTA")
@SQLDelete(sql = "UPDATE puntoventa SET activo = 0 WHERE puntoventa_id = ?")
@Where(clause = "activo = 1")
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
