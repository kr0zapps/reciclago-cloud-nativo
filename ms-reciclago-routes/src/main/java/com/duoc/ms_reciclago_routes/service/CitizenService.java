package com.duoc.ms_reciclago_routes.service;

import com.duoc.ms_reciclago_routes.dto.ContactoRequestDto;
import com.duoc.ms_reciclago_routes.dto.ContactoResponseDto;
import com.duoc.ms_reciclago_routes.model.ContactoCiudadano;
import com.duoc.ms_reciclago_routes.repository.ContactoCiudadanoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CitizenService {

    private static final String KEY_TITULO = "titulo";
    private static final String KEY_DESCRIPCION = "descripcion";
    private static final String KEY_PREGUNTA = "pregunta";
    private static final String KEY_RESPUESTA = "respuesta";

    private final ContactoCiudadanoRepository contactoRepository;

    public CitizenService(ContactoCiudadanoRepository contactoRepository) {
        this.contactoRepository = contactoRepository;
    }

    public ContactoResponseDto registrarContacto(ContactoRequestDto request) {
        String ticketId = "DIMAO-2026-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        ContactoCiudadano nuevo = ContactoCiudadano.builder()
                .ticketId(ticketId)
                .nombre(request.getNombre())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .asunto(request.getAsunto())
                .mensaje(request.getMensaje())
                .status("RECIBIDO")
                .fechaIngreso(LocalDateTime.now(ZoneId.systemDefault()))
                .build();

        contactoRepository.save(nuevo);

        return new ContactoResponseDto(
                ticketId,
                "RECIBIDO",
                "Su solicitud ha sido ingresada a la Dirección de Medio Ambiente de Puerto Varas."
        );
    }

    public List<ContactoCiudadano> listarTodos() {
        return contactoRepository.findAll();
    }

    public Map<String, Object> obtenerGuiaCiudadana() {
        Map<String, Object> guia = new HashMap<>();
        guia.put(KEY_TITULO, "Guía Ciudadana de Reciclaje Puerta a Puerta — Puerto Varas");
        guia.put("comuna", "Puerto Varas");
        guia.put("departamento", "DIMAO - Dirección de Medio Ambiente, Aseo y Ornato");

        List<Map<String, String>> pasos = new ArrayList<>();
        pasos.add(Map.of("paso", "1", KEY_TITULO, "Identifica tu Cuadrante", KEY_DESCRIPCION, "Revisa el día de recolección diferenciada que le corresponde a tu calle."));
        pasos.add(Map.of("paso", "2", KEY_TITULO, "Separa y Limpia", KEY_DESCRIPCION, "Lava, escurre y aplasta tus residuos reciclables (Vidrio, Cartón/Papel, Plásticos, Latas)."));
        pasos.add(Map.of("paso", "3", KEY_TITULO, "Solicita o Entrega", KEY_DESCRIPCION, "Dispón tus bolsas o contenedores verdes antes de las 08:30 hrs o agenda un retiro especial."));
        pasos.add(Map.of("paso", "4", KEY_TITULO, "Pesa y Trazabilidad", KEY_DESCRIPCION, "El equipo municipal pesa tu entrega y se registra en tu historial vecinal para proteger la cuenca del Lago Llanquihue."));

        guia.put("pasos", pasos);
        guia.put("tipCondominios", "Para condominios y edificios, coordinar con la administración municipal retiro consolidado mediante contenedores de 240L.");
        return guia;
    }

    public List<Map<String, String>> obtenerFaqs() {
        List<Map<String, String>> faqs = new ArrayList<>();
        faqs.add(Map.of(
                KEY_PREGUNTA, "¿Qué hago si el camión no pasó en el horario indicado?",
                KEY_RESPUESTA, "Puedes consultar el mapa en tiempo real en la opción 'Seguir mi camión' o ingresar un mensaje de contacto a la mesa DIMAO con tu dirección."
        ));
        faqs.add(Map.of(
                KEY_PREGUNTA, "¿Se pueden entregar botellas con etiquetas de papel?",
                KEY_RESPUESTA, "Sí, no es necesario retirar las etiquetas de papel en botellas de vidrio ni plásticos, pero sí deben estar limpias y sin restos de líquido."
        ));
        faqs.add(Map.of(
                KEY_PREGUNTA, "¿Cómo solicito el retiro de podas y ramas?",
                KEY_RESPUESTA, "Las podas y escombros corresponden a retiros especiales programados una vez al mes por sector. Agenda a través de tu panel vecinal o contáctanos directamente."
        ));
        return faqs;
    }
}
