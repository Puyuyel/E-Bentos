package com.ebentos.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "VENTA")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VENTA_ID")
    private Integer ventaId;

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EVENTO_ID", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GESTOR_USUARIO_ID")
    private Gestor gestor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CLIENTE_USUARIO_ID", nullable = false)
    private Cliente cliente;

    // Campos normales
    @Column(name = "MONTO_TOTAL_ORIGINAL", nullable = false)
    private Double montoTotalOriginal;

    @Column(name = "DESCUENTO_TOTAL", nullable = false)
    private Double descuentoTotal;

    @Column(name = "MONTO_TOTAL_FINAL", nullable = false)
    private Double montoTotalFinal;

    @Column(name = "REGISTRADO_POR_TAQUILLERO", nullable = false, columnDefinition = "TINYINT")
    private Integer registradoPorTaquillero;

    @Enumerated(EnumType.STRING)
    @Column(name = "METODO_PAGO", nullable = false)
    private MetodoPago metodoPago;
    
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Entrada> entradas = new ArrayList<>();
}
