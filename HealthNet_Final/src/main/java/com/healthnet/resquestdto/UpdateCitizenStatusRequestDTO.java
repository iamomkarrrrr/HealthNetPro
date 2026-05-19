package com.healthnet.resquestdto;

import com.healthnet.enums.CitizenStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateCitizenStatusRequestDTO {

	@NotNull(message = "Status is required")
	private CitizenStatus status;
}