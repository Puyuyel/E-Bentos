package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    // Esta columna comparte la clave primaria con Usuario
    @Column(name = "usuario_id")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY) // Opcional: FetchType.LAZY suele ser mejor
    @MapsId // Le dice a JPA que use el ID de Usuario como el ID de esta entidad
    @JoinColumn(name = "usuario_id") // Une en la columna compartida PK/FK
    @ToString.Exclude // Evita bucles en toString()
    private Usuario usuario; // Referencia de vuelta al Usuario

    @Column(name = "PUNTOS_ACUMULADOS")
    private Integer puntosAcumulados;

    @Column(name = "PUNTOS_GASTADOS")
    private Integer puntosGastados;

    @Column(name = "REGISTRADO_POR_TAQUILLERO", columnDefinition = "TINYINT") // Asumiendo que TINYINT mapea a boolean o int
    private Integer registradoPorTaquillero; // O usa int

    @Column(name = "NOMBRES", length = 100)
    private String nombres;

    @Column(name = "APELLIDOS", length = 100)
    private String apellidos;

    @Column(name = "DNI", length = 8)
    private String dni;

    @Column(name = "FECHA_NACIMIENTO")
    private LocalDate fechaNacimiento; // Usa LocalDate para tipo DATE

    @Column(name = "GENERO")
    @Enumerated(EnumType.STRING)
    private Genero genero; // Define un enum Genero si es necesario

    // Metodo auxiliar para enlazar Usuario
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
        if (usuario != null) {
            this.id = usuario.getUsuarioId(); // Establece el ID al enlazar
        }
    }
}

