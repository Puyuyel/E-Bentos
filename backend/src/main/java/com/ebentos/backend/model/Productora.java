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
@Table(name = "PRODUCTORA")
public class Productora extends Usuario{

    @Column(name = "RUC", nullable = false, unique = true, length = 11)
    private String ruc;

    @Column(name = "RAZON_SOCIAL", nullable = false, length = 60)
    private String razonSocial;

    @Column(name = "NOMBRE_COMERCIAL", nullable = false, length = 60)
    private String nombreComercial;

}
