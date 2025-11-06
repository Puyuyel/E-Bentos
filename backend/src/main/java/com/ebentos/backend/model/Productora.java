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
@SQLDelete(sql = "UPDATE USUARIO SET ACTIVO = 0 WHERE USUARIO_ID = ?")
@Where(clause = "ACTIVO = 1")
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
