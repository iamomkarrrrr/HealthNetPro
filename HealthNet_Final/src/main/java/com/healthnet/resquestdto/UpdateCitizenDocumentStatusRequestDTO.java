package com.healthnet.resquestdto;

import com.healthnet.enums.DocumentVerificationStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateCitizenDocumentStatusRequestDTO {

	@NotNull(message = "Verification status is required")
	private DocumentVerificationStatus verificationStatus;
}