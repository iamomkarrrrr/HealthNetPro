package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.CitizenStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CitizenResponseDTO {

	private Long id;

	private Long userId;

	private String name;

	private LocalDate dob;

	private String gender;

	private String address;

	private String contactInfo;

	private CitizenStatus status;
}