package com.healthnet.entity;

import java.time.LocalDate;

import com.healthnet.enums.DiseaseCaseStatus;

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
@Table(name = "disease_cases")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiseaseCase {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long citizenId;

	@Column(nullable = false)
	private Long doctorId;

	@Column(nullable = false)
	private String diseaseType;

	@Column(nullable = false)
	private LocalDate diagnosisDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DiseaseCaseStatus status;
}