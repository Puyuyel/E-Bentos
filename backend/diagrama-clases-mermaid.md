# E-Bentos - Diagrama de Clases (Mermaid)

## Diagrama Completo del Sistema

```mermaid
classDiagram
    %% ============================================
    %% ENUMS
    %% ============================================
    class EstadoEvento {
        <<enumeration>>
        ACTIVO
        PENDIENTE
        CANCELADO
        SOLICITUD_RECHAZADA
    }
    
    class EstadoSolicitud {
        <<enumeration>>
        PENDIENTE
        APROBADA
        RECHAZADA
    }
    
    class TipoLocal {
        <<enumeration>>
        BAR
        CAMPO
        ESTADIO
        TEATRO
    }
    
    class Genero {
        <<enumeration>>
        MASCULINO
        FEMENINO
        OTRO
    }
    
    class MetodoPago {
        <<enumeration>>
        EFECTIVO
        TARJETA
        YAPE
        PLIN
    }
    
    %% ============================================
    %% ENTIDADES PRINCIPALES
    %% ============================================
    class Rol {
        -Integer id
        -String nombre
    }
    
    class Usuario {
        #Integer usuarioId
        #String telefono
        #String email
        #String contrasenha
        #Integer activo
        #String codigoReseteo
        #LocalDateTime expiracionCodigo
    }
    
    class Cliente {
        -Integer puntosAcumulados
        -Integer puntosGastados
        -Integer registradoPorTaquillero
        -String nombres
        -String apellidos
        -String dni
        -LocalDate fechaNacimiento
    }
    
    class Gestor {
        -String dni
        -String nombres
        -String apellidos
    }
    
    class Productora {
        -String ruc
        -String razonSocial
        -String nombreComercial
    }
    
    class Departamento {
        -Integer departamentoId
        -String nombre
    }
    
    class Provincia {
        -Integer provinciaId
        -String nombre
    }
    
    class Distrito {
        -Integer distritoId
        -String nombre
    }
    
    class PuntoVenta {
        -Integer puntoventaId
        -String nombre
        -String direccion
        -Integer activo
    }
    
    class CategoriaEvento {
        -Integer categoriaEventoId
        -String nombre
    }
    
    class Local {
        -Integer localId
        -String nombre
        -String direccion
        -String foto
        -Integer aforo
        -Integer activo
    }
    
    class Evento {
        -Integer eventoId
        -String nombre
        -String descripcion
        -String posterHorizontal
        -String posterVertical
        -LocalDateTime fechaHorarioInicio
        -Integer duracionEstimada
        -Double costoTotal
        -Integer visitas
    }
    
    class Zona {
        -Integer zonaId
        -Integer capacidadTotal
        -String tipoZona
        -String letraZona
        -Integer cantidadEntradasDisponibles
        -Double precioUnitario
        -Double montoTotalRecaudado
        -Integer activo
    }
    
    class Venta {
        -Integer ventaId
        -Double montoTotalOriginal
        -Double descuentoTotal
        -Double montoTotalFinal
        -Integer registradoPorTaquillero
    }
    
    class Meta {
        -Integer metaId
        -Integer metaIngresos
        -Double tasaConversion
        -Integer ticketsObjetivo
        -Integer activo
    }
    
    class Solicitud {
        -Integer localId
        -Integer eventoId
        -String justificacion
    }
    
    %% ============================================
    %% RELACIONES ENTRE ENTIDADES
    %% ============================================
    Usuario <|-- Cliente : hereda
    Usuario <|-- Gestor : hereda
    Usuario <|-- Productora : hereda
    Usuario "1" --> "1" Rol : tiene
    
    Cliente --> Genero : tiene
    Gestor --> Usuario : creado por
    Gestor --> PuntoVenta : asignado a
    
    Departamento "1" --> "*" Provincia : contiene
    Provincia "1" --> "*" Distrito : contiene
    Distrito "1" --> "*" Local : ubicación
    Distrito "1" --> "*" PuntoVenta : ubicación
    
    Local --> Distrito : ubicado en
    Local --> Gestor : gestionado por
    Local --> TipoLocal : tipo
    
    Evento --> Local : se realiza en
    Evento --> Gestor : organizado por
    Evento --> CategoriaEvento : categoría
    Evento --> EstadoEvento : estado
    Evento "1" --> "*" Zona : contiene
    
    Zona --> Local : ubicada en
    Zona --> Evento : pertenece a
    
    Venta --> Evento : para evento
    Venta --> Gestor : registrada por
    Venta --> Cliente : realizada por
    Venta --> MetodoPago : método
    
    Meta --> Evento : mide
    Meta --> Productora : pertenece a
    
    Solicitud --> Local : solicita
    Solicitud --> Evento : para evento
    Solicitud --> EstadoSolicitud : estado
    
    %% ============================================
    %% REPOSITORIOS
    %% ============================================
    class EventoRepository {
        <<interface>>
        +findAll() List~Evento~
        +findById(Integer) Optional~Evento~
        +save(Evento) Evento
    }
    
    class EventoClienteRepository {
        <<interface>>
        +findEventosCliente(Integer) List~EventoClienteDTO~
        +findEventoDetalleById(Integer) List~Object[]~
        +findZonasByEventoId(Integer) List~Object[]~
    }
    
    class LocalRepository {
        <<interface>>
        +findAll() List~Local~
        +buscarPorBuscador(String, Pageable) Page~Local~
        +buscarPorBuscadorYDuenho(String, Integer, Pageable) Page~Local~
    }
    
    class ClienteRepository {
        <<interface>>
        +findAll() List~Cliente~
        +findById(Integer) Optional~Cliente~
        +save(Cliente) Cliente
    }
    
    class GestorRepository {
        <<interface>>
        +findAll() List~Gestor~
        +findById(Integer) Optional~Gestor~
        +save(Gestor) Gestor
    }
    
    class ProductoraRepository {
        <<interface>>
        +findAll() List~Productora~
        +findById(Integer) Optional~Productora~
        +save(Productora) Productora
    }
    
    class VentaRepository {
        <<interface>>
        +findAll() List~Venta~
        +findById(Integer) Optional~Venta~
        +save(Venta) Venta
    }
    
    class MetaRepository {
        <<interface>>
        +findAll() List~Meta~
        +findById(Integer) Optional~Meta~
        +save(Meta) Meta
    }
    
    class SolicitudRepository {
        <<interface>>
        +findAll() List~Solicitud~
        +save(Solicitud) Solicitud
    }
    
    class UsuarioRepository {
        <<interface>>
        +findByEmail(String) Optional~Usuario~
        +save(Usuario) Usuario
    }
    
    class RolRepository {
        <<interface>>
        +findByNombre(String) Optional~Rol~
    }
    
    class DepartamentoRepository {
        <<interface>>
        +findAll() List~Departamento~
    }
    
    class ProvinciaRepository {
        <<interface>>
        +findAll() List~Provincia~
    }
    
    class DistritoRepository {
        <<interface>>
        +findAll() List~Distrito~
        +findById(Integer) Optional~Distrito~
    }
    
    class PuntoVentaRepository {
        <<interface>>
        +findAll() List~PuntoVenta~
        +findById(Integer) Optional~PuntoVenta~
        +save(PuntoVenta) PuntoVenta
    }
    
    class RepLocalesRepository {
        <<interface>>
        +obtenerReporteLocales() List~Object[]~
    }
    
    EventoRepository ..> Evento : gestiona
    EventoClienteRepository ..> Evento : consulta
    LocalRepository ..> Local : gestiona
    ClienteRepository ..> Cliente : gestiona
    GestorRepository ..> Gestor : gestiona
    ProductoraRepository ..> Productora : gestiona
    VentaRepository ..> Venta : gestiona
    MetaRepository ..> Meta : gestiona
    SolicitudRepository ..> Solicitud : gestiona
    UsuarioRepository ..> Usuario : gestiona
    RolRepository ..> Rol : gestiona
    DistritoRepository ..> Distrito : gestiona
    PuntoVentaRepository ..> PuntoVenta : gestiona
    
    %% ============================================
    %% SERVICIOS
    %% ============================================
    class EventoService {
        -EventoRepository eventoRepository
        +obtenerPorId(Integer) EventoDTO
        +listarPaginado(int, int) Map
        +insertar(RegistroEventoDTO) EventoDTO
        +modificar(Integer, EventoActualizaDTO) EventoDTO
        +eliminar(Integer) void
    }
    
    class EventoClienteService {
        -EventoClienteRepository eventoClienteRepository
        +listarEventosCliente(Integer) List~EventoClienteDTO~
        +verDetalleEvento(Integer) EventoClienteDetalleDTO
    }
    
    class LocalService {
        -LocalRepository localRepository
        +obtenerPorId(Integer) LocalDTO
        +listarPaginadoPorBuscador(int, int, String) Map
        +insertar(RegistroLocalDTO) LocalDTO
        +modificar(Integer, LocalActualizaDTO) LocalDTO
    }
    
    class VentaService {
        -VentaRepository ventaRepository
        +obtenerPorId(Integer) VentaDTO
        +listarTodas() List~VentaDTO~
    }
    
    class ClienteService {
        -ClienteRepository clienteRepository
        -UsuarioRepository usuarioRepository
        -RolRepository rolRepository
        +insertar(RegistroClienteDTO) Cliente
        +obtenerPorId(Integer) ClienteDTO
        +modificar(Integer, ClienteActualizaDTO) ClienteDTO
    }
    
    class GestorService {
        -GestorRepository gestorRepository
        -UsuarioRepository usuarioRepository
        -RolRepository rolRepository
        +obtenerPorId(Integer) GestorDTO
        +listarTodas() List~GestorDTO~
        +insertar(RegistroGestorDTO) GestorDTO
        +modificar(Integer, GestorActualizaDTO) GestorDTO
    }
    
    class ProductoraService {
        -ProductoraRepository productoraRepository
        -UsuarioRepository usuarioRepository
        -RolRepository rolRepository
        +obtenerPorId(Integer) ProductoraDTO
        +listarTodas() List~ProductoraDTO~
        +insertar(RegistroProductoraDTO) ProductoraDTO
        +modificar(Integer, ProductoraActualizaDTO) ProductoraDTO
    }
    
    class MetaService {
        -MetaRepository metaRepository
        +obtenerPorId(Integer) MetaDetalleDTO
        +listarTodas() List~MetaDetalleDTO~
        +actualizar(Integer, MetaActualizarDTO) MetaDetalleDTO
    }
    
    class SolicitudService {
        -SolicitudRepository solicitudRepository
        +listarTodas() List~SolicitudDTO~
        +insertar(RegistroSolicitudDTO) SolicitudDTO
        +aprobar(Integer, Integer) void
        +rechazar(Integer, Integer, String) void
    }
    
    class UsuarioService {
        -UsuarioRepository usuarioRepository
        +login(UsuarioLogInDTO) Usuario
        +solicitarResetContrasenha(String) void
        +resetearContrasenha(ContrasenhaResetDTO) void
    }
    
    class DepartamentoService {
        -DepartamentoRepository departamentoRepository
        +listarTodos() List~Departamento~
    }
    
    class ProvinciaService {
        -ProvinciaRepository provinciaRepository
        +listarTodos() List~Provincia~
    }
    
    class DistritoService {
        -DistritoRepository distritoRepository
        +listarTodos() List~DistritoDTO~
    }
    
    class PuntoVentaService {
        -PuntoVentaRepository puntoVentaRepository
        +listarTodos() List~PuntoVentaDTO~
        +insertar(PuntoVentaDTO) PuntoVentaDTO
    }
    
    class RepLocalesService {
        -RepLocalesRepository repLocalesRepository
        +obtenerReporteLocales() List~ReporteLocalDTO~
    }
    
    class EmailService {
        +enviarCodigoReseteo(String, String) void
    }
    
    EventoService --> EventoRepository : usa
    EventoClienteService --> EventoClienteRepository : usa
    LocalService --> LocalRepository : usa
    ClienteService --> ClienteRepository : usa
    ClienteService --> UsuarioRepository : usa
    ClienteService --> RolRepository : usa
    GestorService --> GestorRepository : usa
    GestorService --> UsuarioRepository : usa
    ProductoraService --> ProductoraRepository : usa
    VentaService --> VentaRepository : usa
    MetaService --> MetaRepository : usa
    SolicitudService --> SolicitudRepository : usa
    UsuarioService --> UsuarioRepository : usa
    DistritoService --> DistritoRepository : usa
    PuntoVentaService --> PuntoVentaRepository : usa
    RepLocalesService --> RepLocalesRepository : usa
    
    %% ============================================
    %% CONTROLADORES
    %% ============================================
    class EventoController {
        <<RestController>>
        -EventoService eventoService
        +listarTodas() List~EventoListadoDTO~
        +obtenerPorId(Integer) EventoDTO
        +insertar(RegistroEventoDTO) EventoDTO
        +modificar(Integer, EventoActualizaDTO) EventoDTO
    }
    
    class EventoClienteController {
        <<RestController>>
        -EventoClienteService eventoClienteService
        +listarEventosParaCliente(Integer) List~EventoClienteDTO~
        +verDetalleEvento(Integer) ResponseEntity
    }
    
    class LocalController {
        <<RestController>>
        -LocalService localService
        +listarTodas() List~LocalDTO~
        +obtenerPorId(Integer) LocalDTO
        +insertar(RegistroLocalDTO) LocalDTO
    }
    
    class VentaController {
        <<RestController>>
        -VentaService ventaService
        +listarTodas() List~VentaDTO~
        +obtenerPorId(Integer) VentaDTO
    }
    
    class ClienteController {
        <<RestController>>
        -ClienteService clienteService
        +registrar(RegistroClienteDTO) ResponseEntity
        +obtenerPorId(Integer) ClienteDTO
        +modificar(Integer, ClienteActualizaDTO) ClienteDTO
    }
    
    class GestorController {
        <<RestController>>
        -GestorService gestorService
        +listarTodas() List~GestorDTO~
        +obtenerPorId(Integer) GestorDTO
        +insertar(RegistroGestorDTO) GestorDTO
        +modificar(Integer, GestorActualizaDTO) GestorDTO
    }
    
    class ProductoraController {
        <<RestController>>
        -ProductoraService productoraService
        +listarTodas() List~ProductoraDTO~
        +obtenerPorId(Integer) ProductoraDTO
        +insertar(RegistroProductoraDTO) ProductoraDTO
        +modificar(Integer, ProductoraActualizaDTO) ProductoraDTO
    }
    
    class MetaController {
        <<RestController>>
        -MetaService metaService
        +listarTodas() List~MetaDetalleDTO~
        +obtenerPorId(Integer) MetaDetalleDTO
        +actualizar(Integer, MetaActualizarDTO) MetaDetalleDTO
    }
    
    class SolicitudController {
        <<RestController>>
        -SolicitudService solicitudService
        +listarTodas() List~SolicitudDTO~
        +insertar(RegistroSolicitudDTO) SolicitudDTO
        +aprobar(Integer, Integer) ResponseEntity
        +rechazar(Integer, Integer, String) ResponseEntity
    }
    
    class UsuarioController {
        <<RestController>>
        -UsuarioService usuarioService
        +login(UsuarioLogInDTO) ResponseEntity
        +solicitarReset(String) ResponseEntity
        +resetearContrasenha(ContrasenhaResetDTO) ResponseEntity
    }
    
    class AuthController {
        <<RestController>>
        -UsuarioService usuarioService
        +login(UsuarioLogInDTO) ResponseEntity
        +registrarCliente(RegistroClienteDTO) ResponseEntity
    }
    
    class DepartamentoController {
        <<RestController>>
        -DepartamentoService departamentoService
        +listarTodos() List~Departamento~
    }
    
    class ProvinciaController {
        <<RestController>>
        -ProvinciaService provinciaService
        +listarTodos() List~Provincia~
    }
    
    class DistritoController {
        <<RestController>>
        -DistritoService distritoService
        +listarTodos() List~DistritoDTO~
    }
    
    class PuntoVentaController {
        <<RestController>>
        -PuntoVentaService puntoVentaService
        +listarTodos() List~PuntoVentaDTO~
        +insertar(PuntoVentaDTO) PuntoVentaDTO
    }
    
    class RepLocalesController {
        <<RestController>>
        -RepLocalesService repLocalesService
        +obtenerReporte() List~ReporteLocalDTO~
    }
    
    EventoController --> EventoService : usa
    EventoClienteController --> EventoClienteService : usa
    LocalController --> LocalService : usa
    VentaController --> VentaService : usa
    ClienteController --> ClienteService : usa
    GestorController --> GestorService : usa
    ProductoraController --> ProductoraService : usa
    MetaController --> MetaService : usa
    SolicitudController --> SolicitudService : usa
    UsuarioController --> UsuarioService : usa
    AuthController --> UsuarioService : usa
    DepartamentoController --> DepartamentoService : usa
    ProvinciaController --> ProvinciaService : usa
    DistritoController --> DistritoService : usa
    PuntoVentaController --> PuntoVentaService : usa
    RepLocalesController --> RepLocalesService : usa
    
    %% ============================================
    %% DTOs PRINCIPALES
    %% ============================================
    class EventoClienteDTO {
        <<DTO>>
        -Integer eventoId
        -String nombreLocal
        -String nombreCategoria
        -String nombreEvento
        -LocalDateTime fecha
        -Double zonaDeMenorPrecio
        -Double popularidad
    }
    
    class EventoClienteDetalleDTO {
        <<DTO>>
        -String posterHorizontal
        -String posterVertical
        -String tipoLocal
        -String nombreLocal
        -String direccionLocal
        -String departamento
        -LocalDateTime fecha
    }
    
    class ZonaEventoDTO {
        <<DTO>>
        -Integer cantidadEntradasDisponible
        -Double precioUnitario
        -String tipoZona
        -String letraZona
    }
    
    class EventoDTO {
        <<DTO>>
        -Integer eventoId
        -String nombre
        -String descripcion
        -LocalDateTime fechaHorarioInicio
        -Double costoTotal
    }
    
    class LocalDTO {
        <<DTO>>
        -Integer localId
        -String nombre
        -String direccion
        -Integer aforo
    }
    
    class VentaDTO {
        <<DTO>>
        -Integer ventaId
        -Double montoTotalFinal
        -Integer puntosGanados
    }
    
    class ClienteDTO {
        <<DTO>>
        -Integer usuarioId
        -String telefono
        -String email
        -String dni
        -String nombres
        -String apellidos
        -Integer puntosAcumulados
        -Integer puntosGastados
    }
    
    class GestorDTO {
        <<DTO>>
        -Integer usuarioId
        -String telefono
        -String email
        -String dni
        -String nombres
        -String apellidos
    }
    
    class ProductoraDTO {
        <<DTO>>
        -Integer usuarioId
        -String telefono
        -String email
        -String ruc
        -String razonSocial
        -String nombreComercial
    }
    
    class MetaDetalleDTO {
        <<DTO>>
        -Integer metaId
        -Integer metaIngresos
        -Double tasaConversion
        -Integer ticketsObjetivo
    }
    
    class SolicitudDTO {
        <<DTO>>
        -String justificacion
    }
    
    class DistritoDTO {
        <<DTO>>
        -Integer distritoId
        -String nombre
        -String provincia
        -String departamento
    }
    
    class PuntoVentaDTO {
        <<DTO>>
        -Integer puntoventaId
        -String nombre
        -String direccion
        -Integer activo
    }
    
    class UsuarioLogInDTO {
        <<DTO>>
        -String email
        -String contrasenha
    }
    
    class RegistroClienteDTO {
        <<DTO>>
        -String telefono
        -String email
        -String contrasenha
        -String dni
        -String nombres
        -String apellidos
    }
    
    class RegistroEventoDTO {
        <<DTO>>
        -String nombre
        -String descripcion
        -LocalDateTime fechaHorarioInicio
        -Double costoTotal
    }
    
    class RegistroLocalDTO {
        <<DTO>>
        -String nombre
        -String direccion
        -Integer aforo
    }
    
    class EventoListadoDTO {
        <<DTO>>
        -Integer eventoId
        -String nombreLocal
        -String nombreCategoria
        -String nombreEvento
        -LocalDateTime fecha
        -Double zonaDeMenorPrecio
    }
    
    class EventoSimpleDTO {
        <<DTO>>
        -Integer eventoId
        -String nombre
        -LocalDateTime fechaHorarioInicio
    }
    
    class LocalSimpleDTO {
        <<DTO>>
        -Integer localId
        -String nombre
    }
    
    class GestorSimpleDTO {
        <<DTO>>
        -Integer usuarioId
        -String nombres
        -String apellidos
    }
    
    class ReporteLocalDTO {
        <<DTO>>
        -Integer localId
        -String nombreLocal
        -Integer cantidadEventos
        -Double ingresosTotales
    }
    
    class ZonaDTO {
        <<DTO>>
        -Integer zonaId
        -Integer capacidadTotal
        -String tipoZona
        -String letraZona
        -Double precioUnitario
    }
    
    class RegistroZonaDTO {
        <<DTO>>
        -Integer capacidadTotal
        -String tipoZona
        -String letraZona
        -Double precioUnitario
    }
    
    EventoClienteDetalleDTO "1" --> "*" ZonaEventoDTO : contiene
    EventoDTO "1" --> "*" ZonaDTO : contiene
    RegistroEventoDTO "1" --> "*" RegistroZonaDTO : contiene
    EventoClienteService ..> EventoClienteDTO : produce
    EventoClienteService ..> EventoClienteDetalleDTO : produce
    EventoService ..> EventoDTO : produce
    EventoService ..> EventoListadoDTO : produce
    LocalService ..> LocalDTO : produce
    VentaService ..> VentaDTO : produce
    ClienteService ..> ClienteDTO : produce
    GestorService ..> GestorDTO : produce
    ProductoraService ..> ProductoraDTO : produce
    MetaService ..> MetaDetalleDTO : produce
    SolicitudService ..> SolicitudDTO : produce
    DistritoService ..> DistritoDTO : produce
    PuntoVentaService ..> PuntoVentaDTO : produce
    RepLocalesService ..> ReporteLocalDTO : produce
```

## Cómo visualizar

### En VS Code:
1. Instala la extensión: **Markdown Preview Mermaid Support** (`bierner.markdown-mermaid`)
2. Abre este archivo `.md`
3. Presiona `Ctrl+Shift+V` para preview

### Online:
Copia el código mermaid y pégalo en: https://mermaid.live/

### En GitHub/GitLab:
Este diagrama se renderiza automáticamente al visualizar el archivo `.md`
