package com.ebentos.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROL_ID")
    private Integer id;

    @Column(nullable = false, name = "NOMBRE", length = 45)
    private String nombre;

    //Por si quisiera bidireccionalidad
    //@JsonIgnore
    //@OneToMany(mappedBy = "rol")
    //private List<Usuario> usuarios;

}
