package com.duoc.ms_reciclago_catalog.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String TIMESTAMP = "timestamp";
    private static final String STATUS = "status";
    private static final String ERROR = "error";
    private static final String MESSAGE = "message";

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put(TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(STATUS, HttpStatus.CONFLICT.value());
        error.put(ERROR, "Conflicto de Integridad de Datos");
        error.put(MESSAGE, "El registro viola una restricción de unicidad o clave foránea (ej: código o patente duplicada).");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        error.put(TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(STATUS, HttpStatus.BAD_REQUEST.value());
        error.put(ERROR, "Error de Validación");
        error.put("validationErrors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put(TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(STATUS, HttpStatus.BAD_REQUEST.value());
        error.put(ERROR, "Parámetro Inválido");
        error.put(MESSAGE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put(TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(STATUS, HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put(ERROR, "Error Interno del Servidor");
        error.put(MESSAGE, "Ha ocurrido un error inesperado. Contacte al administrador del sistema.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
