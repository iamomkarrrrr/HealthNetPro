package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.AuditStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditResponseDTO {

	private Long id;

	private Long officerId;

	private String scope;

	private String findings;

	private LocalDate date;

	private AuditStatus status;
}