package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.ComplianceEntityType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComplianceRecordResponseDTO {

	private Long id;

	private Long entityId;

	private ComplianceEntityType type;

	private String result;

	private LocalDate date;

	private String notes;
}