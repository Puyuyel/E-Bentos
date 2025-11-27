package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "ENTRADA")
public class Entrada {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ENTRADA_ID")
    private Integer entradaId;

    // Relación con Venta
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VENTA_ID", nullable = false)
    @ToString.Exclude
    private Venta venta;

    // Relación con Zona
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ZONA_ID", nullable = false)
    @ToString.Exclude
    private Zona zona;

    // Campos normales
    @Column(name = "PRECIO_ORIGINAL", nullable = false)
    private Double precioOriginal;

    @Column(name = "DESCUENTO", nullable = false)
    private Double descuento;

    @Column(name = "PRECIO_FINAL", nullable = false)
    private Double precioFinal;

    // El QR se guardará como BLOB
    @Column(name = "QR", length = 255, nullable = true)
    private String qr;
    
}
