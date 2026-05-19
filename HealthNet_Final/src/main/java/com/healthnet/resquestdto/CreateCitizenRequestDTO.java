package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.CitizenStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateCitizenRequestDTO {

	@NotBlank(message = "Name is required")
	private String name;

	@NotNull(message = "Date of birth is required")
	private LocalDate dob;

	@NotBlank(message = "Gender is required")
	private String gender;

	@NotBlank(message = "Address is required")
	private String address;

	@NotBlank(message = "Contact info is required")
	@Pattern(regexp = "^[0-9]{10}$", message = "Contact info must be exactly 10 digits")
	private String contactInfo;

//	@NotNull(message = "Status is required")
//	private CitizenStatus status;
}