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
@Table(name = "productora")
public class Productora {

    @Id
    // Esta columna comparte la clave primaria con Usuario
    @Column(name = "usuario_id")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY) // Opcional: FetchType.LAZY suele ser mejor
    @MapsId // Le dice a JPA que use el ID de Usuario como el ID de esta entidad
    @JoinColumn(name = "usuario_id") // Une en la columna compartida PK/FK
    @ToString.Exclude // Evita bucles en toString()
    private Usuario usuario; // Referencia de vuelta al Usuario

    @Column(name = "RUC", nullable = false, unique = true, length = 11)
    private String ruc;

    @Column(name = "RAZON_SOCIAL", nullable = false, length = 60)
    private String razonSocial;

    @Column(name = "NOMBRE_COMERCIAL", nullable = false, length = 60)
    private String nombreComercial;

    // Metodo auxiliar para enlazar Usuario
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
        if (usuario != null) {
            this.id = usuario.getUsuarioId(); // Establece el ID al enlazar
        }
    }
}
