package com.healthnet.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.healthnet.entity.Citizen;
import com.healthnet.entity.CitizenDocument;
import com.healthnet.enums.DocumentType;
import com.healthnet.enums.DocumentVerificationStatus;
import com.healthnet.mapper.CitizenDocumentMapper;
import com.healthnet.repository.CitizenDocumentRepository;
import com.healthnet.repository.CitizenRepository;
import com.healthnet.responsedto.CitizenDocumentResponseDTO;
import com.healthnet.resquestdto.CreateCitizenDocumentRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenDocumentStatusRequestDTO;
import com.healthnet.service.CitizenDocumentService;

@Service
public class CitizenDocumentServiceImpl implements CitizenDocumentService {

	private static final String UPLOAD_DIR = "uploads/citizen-documents/";

	private final CitizenDocumentRepository citizenDocumentRepository;
	private final CitizenRepository citizenRepository;

	public CitizenDocumentServiceImpl(CitizenDocumentRepository citizenDocumentRepository,
			CitizenRepository citizenRepository) {
		this.citizenDocumentRepository = citizenDocumentRepository;
		this.citizenRepository = citizenRepository;
	}

	@Override
	public CitizenDocumentResponseDTO createCitizenDocument(CreateCitizenDocumentRequestDTO requestDTO) {

		Citizen citizen = citizenRepository.findById(requestDTO.getCitizenId())
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + requestDTO.getCitizenId()));

		CitizenDocument citizenDocument = CitizenDocumentMapper.toEntity(requestDTO);

		CitizenDocument savedCitizenDocument = citizenDocumentRepository.save(citizenDocument);

		return CitizenDocumentMapper.toResponseDTO(savedCitizenDocument);
	}

	@Override
	public CitizenDocumentResponseDTO uploadCitizenDocument(Long citizenId, DocumentType docType, MultipartFile file) {

		Citizen citizen = citizenRepository.findById(citizenId)
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + citizenId));

		if (file == null || file.isEmpty()) {
			throw new RuntimeException("PDF file is required");
		}

		if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
			throw new RuntimeException("Only PDF files are allowed");
		}

		try {
			Files.createDirectories(Path.of(UPLOAD_DIR));

			String originalFileName = file.getOriginalFilename();

			if (originalFileName == null || !originalFileName.toLowerCase().endsWith(".pdf")) {
				throw new RuntimeException("Uploaded file must have .pdf extension");
			}

			String fileName = "citizen_" + citizenId + "_" + docType.name() + "_" + System.currentTimeMillis() + ".pdf";

			Path filePath = Path.of(UPLOAD_DIR, fileName);

			Files.write(filePath, file.getBytes());

			CitizenDocument citizenDocument = CitizenDocument.builder().citizenId(citizen.getId()).docType(docType)
					.fileUri(filePath.toString()).verificationStatus(DocumentVerificationStatus.PENDING).build();

			CitizenDocument savedDocument = citizenDocumentRepository.save(citizenDocument);

			return CitizenDocumentMapper.toResponseDTO(savedDocument);

		} catch (IOException e) {
			throw new RuntimeException("Failed to upload PDF document: " + e.getMessage());
		}
	}

	@Override
	public Resource downloadCitizenDocument(Long documentId) {

		CitizenDocument document = citizenDocumentRepository.findById(documentId)
				.orElseThrow(() -> new RuntimeException("Citizen document not found with id: " + documentId));

		try {
			Path filePath = Path.of(document.getFileUri());
			Resource resource = new UrlResource(filePath.toUri());

			if (!resource.exists() || !resource.isReadable()) {
				throw new RuntimeException("PDF file not found or not readable");
			}

			return resource;

		} catch (Exception e) {
			throw new RuntimeException("Failed to download PDF document: " + e.getMessage());
		}
	}

	@Override
	public List<CitizenDocumentResponseDTO> getCitizenDocumentsByCitizenId(Long citizenId) {

		return citizenDocumentRepository.findByCitizenId(citizenId).stream().map(CitizenDocumentMapper::toResponseDTO)
				.toList();
	}

	@Override
	public CitizenDocumentResponseDTO updateCitizenDocumentStatus(Long id,
			UpdateCitizenDocumentStatusRequestDTO requestDTO) {

		CitizenDocument existingDocument = citizenDocumentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Citizen document not found with id: " + id));

		existingDocument.setVerificationStatus(requestDTO.getVerificationStatus());

		CitizenDocument updatedDocument = citizenDocumentRepository.save(existingDocument);

		return CitizenDocumentMapper.toResponseDTO(updatedDocument);
	}
}