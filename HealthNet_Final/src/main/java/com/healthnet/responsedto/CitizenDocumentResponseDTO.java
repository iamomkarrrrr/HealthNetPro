package com.healthnet.responsedto;

import java.time.LocalDateTime;

import com.healthnet.enums.DocumentType;
import com.healthnet.enums.DocumentVerificationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CitizenDocumentResponseDTO {

	private Long id;

	private Long citizenId;

	private DocumentType docType;

	private String fileUri;

	private LocalDateTime uploadedDate;

	private DocumentVerificationStatus verificationStatus;
}