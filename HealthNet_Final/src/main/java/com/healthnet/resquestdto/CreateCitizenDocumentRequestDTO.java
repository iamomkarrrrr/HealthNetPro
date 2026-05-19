package com.healthnet.resquestdto;

import com.healthnet.enums.DocumentType;
import com.healthnet.enums.DocumentVerificationStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateCitizenDocumentRequestDTO {

	@NotNull(message = "Citizen ID is required")
	private Long citizenId;

	@NotNull(message = "Document type is required")
	private DocumentType docType;

	@NotBlank(message = "File URI is required")
	private String fileUri;

	@NotNull(message = "Verification status is required")
	private DocumentVerificationStatus verificationStatus;
}