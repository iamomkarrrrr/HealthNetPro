package com.healthnet.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.healthnet.api.APIResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<APIResponse<Object>> handleUserNotFoundException(UserNotFoundException ex) {

		APIResponse<Object> response = APIResponse.builder().status("ERROR").message(ex.getMessage()).data(null)
				.build();

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<APIResponse<Object>> handleInvalidCredentialsException(InvalidCredentialsException ex) {

		APIResponse<Object> response = APIResponse.builder().status("ERROR").message(ex.getMessage()).data(null)
				.build();

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	@ExceptionHandler(InvalidPasswordException.class)
	public ResponseEntity<APIResponse<Object>> handleInvalidPasswordException(InvalidPasswordException ex) {

		APIResponse<Object> response = APIResponse.builder().status("ERROR").message(ex.getMessage()).data(null)
				.build();

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<APIResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {

		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(error -> error.getField() + ": " + error.getDefaultMessage()).findFirst()
				.orElse("Validation failed");

		APIResponse<Object> response = APIResponse.builder().status("ERROR").message(message).data(null).build();

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<APIResponse<Object>> handleHttpMessageNotReadableException(
			HttpMessageNotReadableException ex) {

		APIResponse<Object> response = APIResponse.builder().status("ERROR")
				.message("Invalid request body or enum value").data(null).build();

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<APIResponse<Object>> handleDuplicateResourceException(DuplicateResourceException ex) {

		APIResponse<Object> response = APIResponse.builder().status("ERROR").message(ex.getMessage()).data(null)
				.build();

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<APIResponse<Object>> handleGenericException(Exception ex) {

		APIResponse<Object> response = APIResponse.builder().status("ERROR")
				.message("Something went wrong: " + ex.getMessage()).data(null).build();

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}
}