Aquí tienes la lógica de negocio explicada en simple, en lenguaje funcional y sin código, JSON ni tablas técnicas.

1. La Idea Central (¿Cómo funciona el negocio?)
Olvídate del calendario rígido: No existe eso de "esta semana solo vidrio y si tienes cartón te aguantas un mes".
Es Bajo Demanda (On-Demand): El vecino junta lo que tenga en su casa (vidrio, cartón, plástico o metal) y, cuando ya acumuló suficiente, entra a la plataforma y pide que se lo vayan a buscar.
El Coordinador es el despachador: Recibe esa solicitud, mira su flota de camiones, evalúa cuál tiene espacio libre en los días siguientes y le asigna un camión y una fecha de recolección.
2. El Ciclo de Vida del Retiro (Paso a Paso)
Todo retiro viaja por 5 etapas obligatorias:

text
[VECINO]                                [COORDINADOR]                         [CHOFER]
   │                                          │                                  │
   ▼                                          ▼                                  ▼
SOLICITADO ───────────────► ───────────► PROGRAMADO ──────► EN_RUTA ──────► RETIRADO ──────► PESADO
"Tengo 15 kg de cartón"                "Asignado camión 1                 "Chofer toca    "Balanza marca 16 kg.
                                        para el jueves"                    la puerta"      Certificado listo"
SOLICITADO (El Vecino levanta la mano):
El vecino indica: su dirección, qué material tiene acumulado y cuántos kilos estima que son (ej: 10 kg de vidrio).
La solicitud entra a la bandeja de pendientes del Coordinador.
PROGRAMADO (El Coordinador planifica):
El Coordinador ve la solicitud, selecciona un camión con capacidad disponible y define el día y la hora estimada del retiro.
EN_RUTA (El Camión sale a la calle):
El chofer inicia su jornada o su trayecto hacia el barrio del vecino.
RETIRADO (Recolección física):
El camión llega al domicilio, el chofer recoge los materiales en la puerta y los sube a la tolva.
PESADO (Certificación final):
Con la balanza del camión se registra el pesaje real exacto (ej: el vecino calculó 10 kg, pero pesó 11.5 kg). Con esto se cierra el retiro y se emite el certificado ecológico del vecino.
¿Y si se cancela?
Tanto el vecino como el coordinador pueden CANCELAR, pero solo mientras el camión no haya hecho el retiro. Una vez que el residuo ya se subió al camión (RETIRADO), ya no se puede anular.

3. Las Reglas de Oro (Lo que está terminantemente prohibido)
No se puede salir a buscar (EN_RUTA) algo no programado:
Un chofer no puede ir a retirar una solicitud que esté en estado SOLICITADO. Primero debe pasar por el Coordinador (PROGRAMADO) para tener fecha y camión oficial.
No se puede pesar sin antes haber retirado:
No se puede saltar directo de EN_RUTA a PESADO. Primero se confirma que se recogió en la casa (RETIRADO) y luego se ingresa el pesaje en la balanza.
Un camión en taller no puede recibir asignaciones:
Si un camión está en mantención o averiado, el sistema le impide al Coordinador asignarle retiros.
4. La Regla de la Capacidad del Camión (¿Cuándo y cómo se descuenta?)
¿Quién es el dueño de la regla? El módulo de Catálogo / Flota. Es el que conoce cuánto aguanta cada camión (ej: 1.500 kg) y cuánto espacio le queda.
¿En qué momento exacto se descuenta?
En el momento exacto en que pasa a PROGRAMADO.
Ejemplo: Si el camión tiene 500 kg disponibles y el Coordinador le programa un retiro estimado de 30 kg de cartón, la capacidad disponible del camión baja inmediatamente a 470 kg.
¿Qué pasa si se cancela? Se le devuelven los 30 kg a la capacidad del camión.
¿Qué pasa cuando se completa el pesaje (PESADO)? El camión descarga en la planta de reciclaje y su capacidad vuelve a estar al 100% disponible.
5. Notificaciones y Auditoría (¿Qué se avisa y a quién?)
Al pasar a PROGRAMADO:
Al Vecino: Le llega un correo: "Tu retiro fue agendado para el día Jueves a las 10:00 hrs con el camión Patente PV-RC-20".
Al Chofer: Le aparece en su hoja de ruta del día la dirección y los kilos a retirar.
Auditoría municipal: Queda constancia en el historial de que el Coordinador asignó la orden.
Al pasar a EN_RUTA:
Al Vecino: Se le notifica: "El camión de reciclaje ya va en camino hacia tu domicilio".
Al pasar a PESADO:
Al Vecino: Le llega su certificado oficial con los kilos exactos reciclados y el cálculo de $CO_2$ que evitó contaminar.
6. ¿Cómo interactúan en Pantalla?
Para el Vecino (Sencillez máxima):
Solo necesita 3 datos para pedir el retiro:

Su dirección.
Qué material tiene (un menú donde elige libremente: Vidrio, Cartón, Plástico o Metal).
Kilos aproximados (ej: 5 kg, 10 kg o 20 kg).
Para el Coordinador (Panel de control logístico):
Ve un buzón con las solicitudes pendientes que van creando los vecinos.
Hace clic en "Programar" en una solicitud.
Elige qué camión enviará (viendo cuántos kilos libres le quedan a cada camión).
Elige el día y el turno horario y confirma. Con eso, el camión descuenta los kilos y la orden pasa al chofer.