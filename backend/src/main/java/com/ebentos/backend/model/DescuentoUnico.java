package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "DESCUENTO_UNICO")
public class DescuentoUnico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DESCUENTO_UNICO_ID")
    private Integer descuentoUnicoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DESCUENTO_ID", nullable = false)
    private Descuento descuento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CLIENTE_USUARIO_ID", nullable = false)
    private Cliente cliente;

    @Column(name = "CODIGO_DESCUENTO", nullable = false, length = 11)
    private String codigoDescuento;

    @Column(name = "ESTADO_USADO", nullable = false, columnDefinition = "TINYINT")
    private Integer estadoUsado;
}
