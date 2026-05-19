package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.EpidemiologyDataStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EpidemiologyDataResponseDTO {

	private Long id;

	private Long outbreakId;

	private String metricsJson;

	private LocalDate date;

	private EpidemiologyDataStatus status;
}