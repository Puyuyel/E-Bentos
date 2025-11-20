package com.ebentos.backend.repository;


import com.ebentos.backend.model.Venta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VentaRepository extends JpaRepository<Venta, Integer>{
    
    @Query("SELECT v FROM Venta v WHERE v.evento.fechaHorarioInicio < CURRENT_TIMESTAMP "
            + "and v.cliente.usuarioId = :clienteId")
    List<Venta> findEventosPasadosByCliente(@Param("clienteId") Integer clienteId);
    
    @Query("SELECT v FROM Venta v WHERE v.evento.fechaHorarioInicio >= CURRENT_TIMESTAMP "
            + "AND v.cliente.usuarioId = :clienteId")
    List<Venta> findEventosFuturosByCliente(@Param("clienteId") Integer clienteId);
    

}
