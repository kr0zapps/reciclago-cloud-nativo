package com.duoc.ms_reciclago_pickups.consumer;

import com.duoc.ms_reciclago_pickups.config.RabbitMQConfig;
import com.duoc.ms_reciclago_pickups.dto.EmailEventDto;
import com.rabbitmq.client.Channel;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class EmailNotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationConsumer.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy 'a las' HH:mm 'hrs'");

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    @RabbitListener(id = "email-listener", queues = RabbitMQConfig.QUEUE_EMAIL)
    public void receiveEmailCommand(EmailEventDto emailDto, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            // Validación: si el correo es nulo o inválido, forzar error para mandar a DLQ
            if (emailDto == null || emailDto.getDestinatarioEmail() == null || !emailDto.getDestinatarioEmail().contains("@")) {
                throw new IllegalArgumentException("Email no válido: " + (emailDto != null ? emailDto.getDestinatarioEmail() : "null"));
            }

            log.info("📧 [NOTIFICACIÓN CIUDADANA DIMAO] Procesando Retiro #{}", emailDto.getCodigoRetiro());

            // Envío real con Gmail si está configurado
            if (mailSender != null && mailFrom != null && !mailFrom.isBlank() && !mailFrom.contains("tu-correo")) {
                enviarCorreoHtml(emailDto);
                log.info("✅ [GMAIL SMTP] Correo enriquecido enviado exitosamente a {}", emailDto.getDestinatarioEmail());
            } else {
                log.info("ℹ️ [SIMULACIÓN] Correo procesado: {}", emailDto.getAsunto());
            }

            // Confirmación explícita (ACK)
            channel.basicAck(tag, false);
            log.info("👍 [ACK] Mensaje confirmado en cola {}", RabbitMQConfig.QUEUE_EMAIL);

        } catch (Exception e) {
            log.error("❌ [ERROR CORREO] Desviando mensaje a Dead Letter Queue (DLQ): {}", e.getMessage());
            // NACK sin requeue -> viaja automáticamente a q.cmd.email.dlq
            channel.basicNack(tag, false, false);
        }
    }

    private void enviarCorreoHtml(EmailEventDto emailDto) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        try {
            helper.setFrom(mailFrom, "RecicLaGo Puerto Varas • DIMAO");
        } catch (Exception e) {
            helper.setFrom(mailFrom);
        }

        helper.setTo(emailDto.getDestinatarioEmail());
        helper.setSubject("🌱 " + emailDto.getAsunto());

        String plainText = buildPlainText(emailDto);
        String htmlContent = buildHtmlTemplate(emailDto);

        helper.setText(plainText, htmlContent);
        mailSender.send(mimeMessage);
    }

    private String buildPlainText(EmailEventDto email) {
        String nombre = email.getDestinatarioNombre() != null ? email.getDestinatarioNombre() : "Vecino/a";
        return "========================================================\n"
                + "  🌱 RECICLAGO • MUNICIPALIDAD DE PUERTO VARAS (DIMAO)  \n"
                + "========================================================\n\n"
                + "Hola " + nombre + ",\n\n"
                + email.getMensaje() + "\n\n"
                + "--------------------------------------------------------\n"
                + "DETALLES DEL SERVICIO:\n"
                + "• Código de Retiro : " + email.getCodigoRetiro() + "\n"
                + "• Estado Actual    : " + email.getNuevoEstado() + "\n"
                + (email.getDireccion() != null ? "• Dirección        : " + email.getDireccion() + " (" + (email.getComuna() != null ? email.getComuna() : "Puerto Varas") + ")\n" : "")
                + (email.getResiduoNombre() != null ? "• Tipo Residuo     : " + email.getResiduoNombre() + (email.getPesoEstimadoKg() != null ? " (~" + email.getPesoEstimadoKg() + " kg)" : "") + "\n" : "")
                + (email.getCamionPatente() != null && !email.getCamionPatente().isBlank() ? "• Camión Asignado  : Patente " + email.getCamionPatente() + "\n" : "")
                + "• Fecha y Hora     : " + formatearFecha(email.getFechaEvento()) + "\n"
                + "--------------------------------------------------------\n\n"
                + "Consejo DIMAO: Recuerda entregar tus residuos limpios, secos y compactados para proteger el Lago Llanquihue.\n\n"
                + "Atte.\n"
                + "Dirección de Medio Ambiente, Aseo y Ornato (DIMAO)\n"
                + "Municipalidad de Puerto Varas\n";
    }

    private String buildHtmlTemplate(EmailEventDto email) {
        String nombre = email.getDestinatarioNombre() != null ? escapeHtml(email.getDestinatarioNombre()) : "Vecino/a";
        String codigo = email.getCodigoRetiro() != null ? escapeHtml(email.getCodigoRetiro()) : "S/C";
        String estado = email.getNuevoEstado() != null ? email.getNuevoEstado() : "ACTUALIZADO";
        String mensaje = email.getMensaje() != null ? escapeHtml(email.getMensaje()) : "";
        String fecha = formatearFecha(email.getFechaEvento());

        // Configuración de estilo según estado
        EstadoVisual visual = EstadoVisual.from(estado);

        StringBuilder detallesHtml = new StringBuilder();
        agregarFilaDetalle(detallesHtml, "Código de Retiro", "<span style=\"font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-weight: 700; color: #0f172a; background: #e2e8f0; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px;\">" + codigo + "</span>");
        agregarFilaDetalle(detallesHtml, "Estado Actual", "<span style=\"display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; background: " + visual.badgeBg + "; color: " + visual.accentColor + "; border: 1px solid " + visual.borderColor + ";\">" + visual.icon + " " + visual.titulo + "</span>");

        if (email.getDireccion() != null && !email.getDireccion().isBlank()) {
            String comunaStr = (email.getComuna() != null && !email.getComuna().isBlank()) ? email.getComuna() : "Puerto Varas";
            agregarFilaDetalle(detallesHtml, "Dirección", escapeHtml(email.getDireccion()) + ", " + escapeHtml(comunaStr));
        }

        if (email.getResiduoNombre() != null && !email.getResiduoNombre().isBlank()) {
            String pesoStr = (email.getPesoEstimadoKg() != null && email.getPesoEstimadoKg() > 0)
                    ? " (" + email.getPesoEstimadoKg() + " kg aprox.)"
                    : "";
            agregarFilaDetalle(detallesHtml, "Material", escapeHtml(email.getResiduoNombre()) + pesoStr);
        }

        if (email.getCamionPatente() != null && !email.getCamionPatente().isBlank()) {
            agregarFilaDetalle(detallesHtml, "Camión Asignado", "<strong style=\"color: #047857;\">Patente " + escapeHtml(email.getCamionPatente()) + "</strong>");
        }

        agregarFilaDetalle(detallesHtml, "Fecha del Evento", fecha);

        return "<!DOCTYPE html>\n"
                + "<html lang=\"es\">\n"
                + "<head>\n"
                + "  <meta charset=\"UTF-8\">\n"
                + "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
                + "  <title>" + escapeHtml(email.getAsunto()) + "</title>\n"
                + "</head>\n"
                + "<body style=\"margin: 0; padding: 30px 10px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;\">\n"
                + "  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n"
                + "    <tr>\n"
                + "      <td align=\"center\">\n"
                + "        <!-- Tarjeta Principal -->\n"
                + "        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;\">\n"
                + "          \n"
                + "          <!-- Header Institucional -->\n"
                + "          <tr>\n"
                + "            <td style=\"background: linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%); padding: 36px 32px 30px 32px; text-align: left;\">\n"
                + "              <div style=\"font-size: 11px; font-weight: 700; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;\">MUNICIPALIDAD DE PUERTO VARAS • DIMAO</div>\n"
                + "              <h1 style=\"margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;\">🌱 RecicLaGo</h1>\n"
                + "              <div style=\"font-size: 14px; color: #ecfdf5; margin-top: 6px; font-weight: 400;\">Sistema Integral de Reciclaje Puerta a Puerta</div>\n"
                + "            </td>\n"
                + "          </tr>\n"
                + "          \n"
                + "          <!-- Barra de Estado Visual -->\n"
                + "          <tr>\n"
                + "            <td style=\"background-color: " + visual.bannerBg + "; padding: 16px 32px; border-bottom: 1px solid " + visual.borderColor + ";\">\n"
                + "              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n"
                + "                <tr>\n"
                + "                  <td width=\"36\" valign=\"middle\" style=\"font-size: 24px;\">" + visual.icon + "</td>\n"
                + "                  <td valign=\"middle\" style=\"padding-left: 10px;\">\n"
                + "                    <div style=\"font-size: 14px; font-weight: 700; color: " + visual.accentColor + ";\">" + visual.titulo + "</div>\n"
                + "                    <div style=\"font-size: 12px; color: #64748b;\">" + visual.subtitulo + "</div>\n"
                + "                  </td>\n"
                + "                </tr>\n"
                + "              </table>\n"
                + "            </td>\n"
                + "          </tr>\n"
                + "          \n"
                + "          <!-- Cuerpo del Mensaje -->\n"
                + "          <tr>\n"
                + "            <td style=\"padding: 32px 32px 24px 32px;\">\n"
                + "              <h2 style=\"margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;\">¡Hola " + nombre + "! 👋</h2>\n"
                + "              \n"
                + "              <!-- Callout con el Mensaje Principal -->\n"
                + "              <div style=\"background-color: #f8fafc; border-left: 4px solid " + visual.accentColor + "; padding: 18px 20px; border-radius: 0 12px 12px 0; font-size: 15px; color: #334155; margin-bottom: 26px; line-height: 1.6;\">\n"
                + "                " + mensaje + "\n"
                + "              </div>\n"
                + "              \n"
                + "              <!-- Cuadro de Detalles del Retiro -->\n"
                + "              <div style=\"border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 26px;\">\n"
                + "                <div style=\"background-color: #f8fafc; padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.8px;\">Información de la Solicitud</div>\n"
                + "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"padding: 8px 18px;\">\n"
                + "                  " + detallesHtml.toString() + "\n"
                + "                </table>\n"
                + "              </div>\n"
                + "              \n"
                + "              <!-- Consejo de Sustentabilidad -->\n"
                + "              <div style=\"background-color: #f0fdf4; border: 1px dashed #86efac; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px;\">\n"
                + "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n"
                + "                  <tr>\n"
                + "                    <td width=\"28\" valign=\"top\" style=\"font-size: 20px;\">🌊</td>\n"
                + "                    <td style=\"padding-left: 10px; font-size: 13px; color: #166534; line-height: 1.5;\">\n"
                + "                      <strong style=\"color: #14532d;\">Compromiso Comunal Puerto Varas</strong><br>\n"
                + "                      Recuerda entregar los residuos limpios, secos y compactados. Juntos reducimos la huella de carbono y protegemos la cuenca del Lago Llanquihue.\n"
                + "                    </td>\n"
                + "                  </tr>\n"
                + "                </table>\n"
                + "              </div>\n"
                + "            </td>\n"
                + "          </tr>\n"
                + "          \n"
                + "          <!-- Footer -->\n"
                + "          <tr>\n"
                + "            <td style=\"background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;\">\n"
                + "              <div style=\"font-size: 13px; font-weight: 700; color: #334155;\">Dirección de Medio Ambiente, Aseo y Ornato (DIMAO)</div>\n"
                + "              <div style=\"font-size: 12px; color: #64748b; margin-top: 4px;\">Ilustre Municipalidad de Puerto Varas • San Francisco 413, Puerto Varas</div>\n"
                + "              <div style=\"font-size: 11px; color: #94a3b8; margin-top: 14px; line-height: 1.4;\">\n"
                + "                Este es un correo institucional generado automáticamente por la plataforma RecicLaGo Cloud-Nativa.<br>\n"
                + "                Por favor no responda directamente a esta casilla.\n"
                + "              </div>\n"
                + "            </td>\n"
                + "          </tr>\n"
                + "          \n"
                + "        </table>\n"
                + "      </td>\n"
                + "    </tr>\n"
                + "  </table>\n"
                + "</body>\n"
                + "</html>";
    }

    private void agregarFilaDetalle(StringBuilder sb, String etiqueta, String valor) {
        sb.append("<tr>\n")
                .append("  <td style=\"padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #64748b; font-weight: 500; width: 40%;\">").append(etiqueta).append("</td>\n")
                .append("  <td style=\"padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #1e293b; text-align: right; width: 60%;\">").append(valor).append("</td>\n")
                .append("</tr>\n");
    }

    private String formatearFecha(LocalDateTime fecha) {
        if (fecha == null) {
            return LocalDateTime.now().format(DATE_FORMATTER);
        }
        return fecha.format(DATE_FORMATTER);
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private static class EstadoVisual {
        final String titulo;
        final String subtitulo;
        final String icon;
        final String accentColor;
        final String bannerBg;
        final String badgeBg;
        final String borderColor;

        EstadoVisual(String titulo, String subtitulo, String icon, String accentColor, String bannerBg, String badgeBg, String borderColor) {
            this.titulo = titulo;
            this.subtitulo = subtitulo;
            this.icon = icon;
            this.accentColor = accentColor;
            this.bannerBg = bannerBg;
            this.badgeBg = badgeBg;
            this.borderColor = borderColor;
        }

        static EstadoVisual from(String estado) {
            if (estado == null) {
                return new EstadoVisual("ACTUALIZACIÓN", "Estado del retiro actualizado", "ℹ️", "#059669", "#ecfdf5", "#d1fae5", "#a7f3d0");
            }
            return switch (estado.toUpperCase()) {
                case "SOLICITADO" -> new EstadoVisual("SOLICITUD INGRESADA", "En cola para asignación de ruta", "📋", "#2563eb", "#eff6ff", "#dbeafe", "#bfdbfe");
                case "PROGRAMADO" -> new EstadoVisual("RETIRO PROGRAMADO", "Agendado en cuadrante municipal", "📅", "#4f46e5", "#eef2ff", "#e0e7ff", "#c7d2fe");
                case "EN_RUTA" -> new EstadoVisual("CAMIÓN EN CAMINO", "El camión recolector se dirige a tu domicilio", "🚚", "#d97706", "#fffbeb", "#fef3c7", "#fde68a");
                case "RETIRADO" -> new EstadoVisual("RESIDUOS RETIRADOS", "Recolección completada con éxito", "✅", "#059669", "#ecfdf5", "#d1fae5", "#a7f3d0");
                case "PESADO" -> new EstadoVisual("PESAJE Y CERTIFICACIÓN", "Pesaje completado y certificado disponible", "⚖️", "#0d9488", "#f0fdfa", "#ccfbf1", "#99f6e4");
                case "CANCELADO" -> new EstadoVisual("SOLICITUD CANCELADA", "La solicitud fue cancelada", "❌", "#dc2626", "#fef2f2", "#fee2e2", "#fecaca");
                default -> new EstadoVisual("ESTADO: " + estado, "Estado actualizado", "ℹ️", "#059669", "#ecfdf5", "#d1fae5", "#a7f3d0");
            };
        }
    }
}

