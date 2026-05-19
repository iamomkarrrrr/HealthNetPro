package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.EpidemiologyDataStatus;

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
public class CreateEpidemiologyDataRequestDTO {

	@NotNull(message = "Outbreak ID is required")
	private Long outbreakId;

	@NotBlank(message = "Metrics JSON is required")
	private String metricsJson;

	@NotNull(message = "Date is required")
	private LocalDate date;

	@NotNull(message = "Status is required")
	private EpidemiologyDataStatus status;
}