package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.OutbreakStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OutbreakResponseDTO {

	private Long id;

	private String diseaseType;

	private String location;

	private LocalDate startDate;

	private LocalDate endDate;

	private OutbreakStatus status;
}
