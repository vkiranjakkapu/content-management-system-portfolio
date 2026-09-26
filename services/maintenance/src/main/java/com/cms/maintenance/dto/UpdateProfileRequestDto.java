package com.cms.maintenance.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;

public record UpdateProfileRequestDto(
		MultipartFile dp,
		@Email String email,
		String name,
		String phone,
		String designation,
		String location,
		MultipartFile banner) {

}
