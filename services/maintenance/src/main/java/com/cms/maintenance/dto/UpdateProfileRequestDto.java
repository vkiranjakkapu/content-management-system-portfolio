package com.cms.maintenance.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;

public record UpdateProfileRequestDto(
		MultipartFile dp,
		@Email String email,
		String name,
		String phone,
		LocalDate dob) {

}
