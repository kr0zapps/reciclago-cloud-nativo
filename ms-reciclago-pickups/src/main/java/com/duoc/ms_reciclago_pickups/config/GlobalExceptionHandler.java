package com.duoc.ms_reciclago_pickups.config;

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
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String KEY_TIMESTAMP = "timestamp";
    private static final String KEY_STATUS = "status";
    private static final String KEY_ERROR = "error";
    private static final String KEY_MESSAGE = "message";

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put(KEY_TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(KEY_STATUS, HttpStatus.BAD_REQUEST.value());
        error.put(KEY_ERROR, "Transición de Estado Inválida");
        error.put(KEY_MESSAGE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put(KEY_TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(KEY_STATUS, HttpStatus.BAD_REQUEST.value());
        error.put(KEY_ERROR, "Parámetro Inválido");
        error.put(KEY_MESSAGE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoSuchElementException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put(KEY_TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(KEY_STATUS, HttpStatus.NOT_FOUND.value());
        error.put(KEY_ERROR, "Recurso No Encontrado");
        error.put(KEY_MESSAGE, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        error.put(KEY_TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(KEY_STATUS, HttpStatus.BAD_REQUEST.value());
        error.put(KEY_ERROR, "Error de Validación");
        error.put("validationErrors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put(KEY_TIMESTAMP, LocalDateTime.now(ZoneId.systemDefault()));
        error.put(KEY_STATUS, HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put(KEY_ERROR, "Error Interno del Servidor");
        error.put(KEY_MESSAGE, "Ha ocurrido un error inesperado. Contacte al administrador del sistema.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
