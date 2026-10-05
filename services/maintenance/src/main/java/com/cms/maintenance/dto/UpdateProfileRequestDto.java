package com.cms.maintenance.dto;

import jakarta.validation.constraints.Email;

public record UpdateProfileRequestDto(
		String dp,
		@Email String email,
		String name,
		String phone,
		String designation,
		String location,
		String availability,
		String banner) {

}
