package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.AuditStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateAuditRequestDTO {

	@NotBlank(message = "Audit scope is required")
	private String scope;

	@NotBlank(message = "Findings are required")
	private String findings;

	@NotNull(message = "Date is required")
	private LocalDate date;

	@NotNull(message = "Status is required")
	private AuditStatus status;
}