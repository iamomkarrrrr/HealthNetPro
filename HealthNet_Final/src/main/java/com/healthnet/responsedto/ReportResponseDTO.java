package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.ReportScope;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportResponseDTO {

	private Long id;

	private ReportScope scope;

	private String metrics;

	private LocalDate generatedDate;
}