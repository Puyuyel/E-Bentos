INSERT INTO LOCAL (
  DISTRITO_ID, GESTOR_USUARIO_ID, NOMBRE, DIRECCION, FOTO,
  DNI_PROPIETARIO, NOMBRE_COMPLETO_PROPIETARIO, DNI_RESPONSABLE, NOMBRE_COMPLETO_RESPONSABLE,
  TELEFONO_CONTACTO1, TELEFONO_CONTACTO2, CORREO_CONTACTO, AFORO, TIPO_LOCAL, ESTADO
) VALUES
(1, 4, 'La Noche de Barranco', 'Av. Bolognesi 307, Barranco', 'noche.jpg',
 '45321123', 'Carlos Salazar Ríos', '87654321', 'Laura Campos Ruiz',
 '987654321', '923456789', 'lanoche@local.pe', 500, 'BAR', 'ACTIVO'),

(2, 4, 'Campo Verde Arena', 'Carretera Sur km 8, Lima', 'campo.jpg',
 '55443322', 'María Torres Díaz', '99887766', 'Pedro Gálvez Soto',
 '945612378', NULL, 'campoverde@local.pe', 3000, 'CAMPO', 'ACTIVO'),

(2, 4, 'Teatro Central Lima', 'Av. Arequipa 1234, San Isidro', 'teatro.jpg',
 '33442211', 'Luis Vega Ramos', '88776655', 'Carmen Paredes Lazo',
 '912345678', NULL, 'teatrocentral@local.pe', 800, 'TEATRO', 'ACTIVO');
 
INSERT INTO CATEGORIA_EVENTO VALUES(1,'CONCIERTO'),(2,'TEATRO'),(3, 'FESTIVAL');

INSERT INTO EVENTO (
  LOCAL_ID, GESTOR_USUARIO_ID, CATEGORIA_EVENTO_ID, NOMBRE, DESCRIPCION, POSTER,
  FECHA_HORARIO_INICIO, DURACION_ESTIMADA, COSTO_TOTAL, VISITAS
) VALUES
(1, 7, 1, 'Rock en la Noche', 'Concierto de bandas locales de rock alternativo.', 'rock.jpg',
 '2025-12-05 21:00:00', 180, 15000.00, 1200),

(2, 7, 3, 'Festival del Sol', 'Festival de música electrónica y food trucks.', 'festival.jpg',
 '2025-12-20 15:00:00', 600, 50000.00, 3000),

(3, 7, 2, 'Obra "Sueños de Lima"', 'Representación teatral contemporánea sobre la vida urbana.', 'teatro_obra.jpg',
 '2025-11-15 19:00:00', 120, 8000.00, 900);
 
INSERT INTO ZONA (
  LOCAL_ID, EVENTO_ID, CAPACIDAD_TOTAL, TIPO_ZONA, LETRA_ZONA, ACTIVO,
  CANTIDAD_ENTRADAS_DISPONIBLES, PRECIO_UNITARIO, MONTO_TOTAL_RECAUDADO
) VALUES
-- Zonas para evento 1: Rock en la Noche
(1, 1, 200, 'General', 'A', 1, 150, 40.00, 2000.00),
(1, 1, 100, 'VIP', 'B', 1, 80, 80.00, 1600.00),

-- Zonas para evento 2: Festival del Sol
(2, 2, 1000, 'Campo Libre', 'A', 1, 900, 60.00, 6000.00),
(2, 2, 300, 'Zona VIP', 'B', 1, 250, 120.00, 6000.00),
(2, 2, 100, 'Backstage', 'C', 1, 90, 250.00, 2500.00),

-- Zonas para evento 3: Sueños de Lima
(3, 3, 400, 'Platea', 'A', 1, 300, 50.00, 5000.00),
(3, 3, 200, 'Palco', 'B', 1, 180, 90.00, 1800.00);
 