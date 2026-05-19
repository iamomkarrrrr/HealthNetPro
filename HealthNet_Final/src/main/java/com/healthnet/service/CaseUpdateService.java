package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.CaseUpdateResponseDTO;
import com.healthnet.resquestdto.CreateCaseUpdateRequestDTO;
import com.healthnet.resquestdto.UpdateCaseUpdateRequestDTO;

public interface CaseUpdateService {

	CaseUpdateResponseDTO createCaseUpdate(CreateCaseUpdateRequestDTO requestDTO);

	List<CaseUpdateResponseDTO> getCaseUpdatesByCaseId(Long caseId);

	CaseUpdateResponseDTO updateCaseUpdate(Long id, UpdateCaseUpdateRequestDTO requestDTO);
}
