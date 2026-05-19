package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.ReportScope;

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
public class UpdateReportRequestDTO {

	@NotNull(message = "Report scope is required")
	private ReportScope scope;

	@NotBlank(message = "Metrics are required")
	private String metrics;

	@NotNull(message = "Generated date is required")
	private LocalDate generatedDate;
}