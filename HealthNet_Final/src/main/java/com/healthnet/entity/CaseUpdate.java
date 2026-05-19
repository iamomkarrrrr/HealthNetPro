package com.healthnet.entity;

import java.time.LocalDate;

import com.healthnet.enums.CaseUpdateStatus;

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
@Table(name = "case_updates")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CaseUpdate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long caseId;

	@Column(nullable = false)
	private Long doctorId;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String notes;

	@Column(nullable = false)
	private LocalDate date;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CaseUpdateStatus status;
}