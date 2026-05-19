package com.healthnet.mapper;

import com.healthnet.entity.CitizenDocument;
import com.healthnet.responsedto.CitizenDocumentResponseDTO;
import com.healthnet.resquestdto.CreateCitizenDocumentRequestDTO;

public class CitizenDocumentMapper {

	public static CitizenDocument toEntity(CreateCitizenDocumentRequestDTO requestDTO) {
		return CitizenDocument.builder().citizenId(requestDTO.getCitizenId()).docType(requestDTO.getDocType())
				.fileUri(requestDTO.getFileUri()).verificationStatus(requestDTO.getVerificationStatus()).build();
	}

	public static CitizenDocumentResponseDTO toResponseDTO(CitizenDocument citizenDocument) {
		return CitizenDocumentResponseDTO.builder().id(citizenDocument.getId())
				.citizenId(citizenDocument.getCitizenId()).docType(citizenDocument.getDocType())
				.fileUri(citizenDocument.getFileUri()).uploadedDate(citizenDocument.getUploadedDate())
				.verificationStatus(citizenDocument.getVerificationStatus()).build();
	}
}
