package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.ComplianceEntityType;

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
public class UpdateComplianceRecordRequestDTO {

	@NotNull(message = "Entity ID is required")
	private Long entityId;

	@NotNull(message = "Entity type is required")
	private ComplianceEntityType type;

	@NotBlank(message = "Result is required")
	private String result;

	@NotNull(message = "Date is required")
	private LocalDate date;

	private String notes;
}