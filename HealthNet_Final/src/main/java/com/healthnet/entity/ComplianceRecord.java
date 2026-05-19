package com.healthnet.entity;

import java.time.LocalDate;

import com.healthnet.enums.ComplianceEntityType;

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
@Table(name = "compliance_records")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComplianceRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // ComplianceID

	@Column(nullable = false)
	private Long entityId; // CaseID / OutbreakID / VaccinationID

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ComplianceEntityType type; // CASE / OUTBREAK / VACCINATION

	@Column(nullable = false)
	private String result; // PASS / FAIL / NON_COMPLIANT etc.

	@Column(nullable = false)
	private LocalDate date;

	@Column(columnDefinition = "TEXT")
	private String notes;
}