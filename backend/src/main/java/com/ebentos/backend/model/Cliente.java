package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
@Table(name = "CLIENTE")
public class Cliente extends Usuario{

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

}

