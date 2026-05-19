package com.healthnet.entity;

import java.time.LocalDate;

import com.healthnet.enums.ReportScope;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Report {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // ReportID

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ReportScope scope; // CASE / OUTBREAK / VACCINATION / COMPLIANCE

	@Column(nullable = false, columnDefinition = "TEXT")
	private String metrics; // Aggregated metrics (JSON / summary text)

	@Column(nullable = false)
	private LocalDate generatedDate;
}