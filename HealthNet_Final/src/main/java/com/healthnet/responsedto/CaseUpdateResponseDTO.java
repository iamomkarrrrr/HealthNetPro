package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.CaseUpdateStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CaseUpdateResponseDTO {

	private Long id;

	private Long caseId;

	private Long doctorId;

	private String notes;

	private LocalDate date;

	private CaseUpdateStatus status;
}