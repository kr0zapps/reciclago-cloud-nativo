package com.duoc.ms_reciclago_routes.service;

import com.duoc.ms_reciclago_routes.dto.ContactoRequestDto;
import com.duoc.ms_reciclago_routes.dto.ContactoResponseDto;
import com.duoc.ms_reciclago_routes.model.ContactoCiudadano;
import com.duoc.ms_reciclago_routes.repository.ContactoCiudadanoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class CitizenService {

    private final ContactoCiudadanoRepository contactoRepository;

    public CitizenService(ContactoCiudadanoRepository contactoRepository) {
        this.contactoRepository = contactoRepository;
    }

    public ContactoResponseDto registrarContacto(ContactoRequestDto request) {
        String ticketId = "DIMAO-2026-" + String.format("%04d", (System.currentTimeMillis() % 10000));

        ContactoCiudadano nuevo = new ContactoCiudadano(
                null,
                ticketId,
                request.getNombre(),
                request.getEmail(),
                request.getTelefono(),
                request.getAsunto(),
                request.getMensaje(),
                "RECIBIDO",
                LocalDateTime.now()
        );

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
        guia.put("titulo", "Guía Ciudadana de Reciclaje Puerta a Puerta — Puerto Varas");
        guia.put("comuna", "Puerto Varas");
        guia.put("departamento", "DIMAO - Dirección de Medio Ambiente, Aseo y Ornato");

        List<Map<String, String>> pasos = new ArrayList<>();
        pasos.add(Map.of("paso", "1", "titulo", "Identifica tu Cuadrante", "descripcion", "Revisa el día de recolección diferenciada que le corresponde a tu calle."));
        pasos.add(Map.of("paso", "2", "titulo", "Separa y Limpia", "descripcion", "Lava, escurre y aplasta tus residuos reciclables (Vidrio, Cartón/Papel, Plásticos, Latas)."));
        pasos.add(Map.of("paso", "3", "titulo", "Solicita o Entrega", "descripcion", "Dispón tus bolsas o contenedores verdes antes de las 08:30 hrs o agenda un retiro especial."));
        pasos.add(Map.of("paso", "4", "titulo", "Pesa y Trazabilidad", "descripcion", "El equipo municipal pesa tu entrega y se registra en tu historial vecinal para proteger la cuenca del Lago Llanquihue."));

        guia.put("pasos", pasos);
        guia.put("tipCondominios", "Para condominios y edificios, coordinar con la administración municipal retiro consolidado mediante contenedores de 240L.");
        return guia;
    }

    public List<Map<String, String>> obtenerFaqs() {
        List<Map<String, String>> faqs = new ArrayList<>();
        faqs.add(Map.of(
                "pregunta", "¿Qué hago si el camión no pasó en el horario indicado?",
                "respuesta", "Puedes consultar el mapa en tiempo real en la opción 'Seguir mi camión' o ingresar un mensaje de contacto a la mesa DIMAO con tu dirección."
        ));
        faqs.add(Map.of(
                "pregunta", "¿Se pueden entregar botellas con etiquetas de papel?",
                "respuesta", "Sí, no es necesario retirar las etiquetas de papel en botellas de vidrio ni plásticos, pero sí deben estar limpias y sin restos de líquido."
        ));
        faqs.add(Map.of(
                "pregunta", "¿Cómo solicito el retiro de podas y ramas?",
                "respuesta", "Las podas y escombros corresponden a retiros especiales programados una vez al mes por sector. Agenda a través de tu panel vecinal o contáctanos directamente."
        ));
        return faqs;
    }
}
