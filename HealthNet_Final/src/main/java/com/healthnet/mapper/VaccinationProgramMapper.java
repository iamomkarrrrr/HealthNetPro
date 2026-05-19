package com.healthnet.mapper;

import com.healthnet.entity.VaccinationProgram;
import com.healthnet.responsedto.VaccinationProgramResponseDTO;
import com.healthnet.resquestdto.CreateVaccinationProgramRequestDTO;

public class VaccinationProgramMapper {

    public static VaccinationProgram toEntity(CreateVaccinationProgramRequestDTO requestDTO) {
        return VaccinationProgram.builder()
                .title(requestDTO.getTitle())
                .vaccineType(requestDTO.getVaccineType())
                .description(requestDTO.getDescription())
                .startDate(requestDTO.getStartDate())
                .endDate(requestDTO.getEndDate())
                .status(requestDTO.getStatus())
                .build();
    }

    public static VaccinationProgramResponseDTO toResponseDTO(VaccinationProgram program) {
        return VaccinationProgramResponseDTO.builder()
                .id(program.getId())
                .title(program.getTitle())
                .vaccineType(program.getVaccineType())
                .description(program.getDescription())
                .startDate(program.getStartDate())
                .endDate(program.getEndDate())
                .status(program.getStatus())
                .build();
    }
}