package com.healthnet.entity;

import java.time.LocalDateTime;

import com.healthnet.enums.DocumentType;
import com.healthnet.enums.DocumentVerificationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "citizen_documents")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CitizenDocument {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long citizenId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DocumentType docType;

	@Column(nullable = false)
	private String fileUri;

	@Column(nullable = false)
	private LocalDateTime uploadedDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DocumentVerificationStatus verificationStatus;

	@PrePersist
	public void prePersist() {
		this.uploadedDate = LocalDateTime.now();
	}
}
