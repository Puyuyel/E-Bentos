package com.ebentos.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudId implements Serializable {
    @Column(name = "LOCAL_ID")
    private Long localId;

    @Column(name = "EVENTO_ID")
    private Long eventoId;
}

