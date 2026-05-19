package com.healthnet.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.healthnet.enums.DocumentType;
import com.healthnet.responsedto.CitizenDocumentResponseDTO;
import com.healthnet.resquestdto.CreateCitizenDocumentRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenDocumentStatusRequestDTO;

public interface CitizenDocumentService {

	CitizenDocumentResponseDTO createCitizenDocument(CreateCitizenDocumentRequestDTO requestDTO);

	CitizenDocumentResponseDTO uploadCitizenDocument(Long citizenId, DocumentType docType, MultipartFile file);

	Resource downloadCitizenDocument(Long documentId);

	List<CitizenDocumentResponseDTO> getCitizenDocumentsByCitizenId(Long citizenId);

	CitizenDocumentResponseDTO updateCitizenDocumentStatus(Long id, UpdateCitizenDocumentStatusRequestDTO requestDTO);
}