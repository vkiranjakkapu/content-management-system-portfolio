package com.cms.maintenance.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record CreateProfileRequestDto(
        @NotEmpty MultipartFile dp,
        @NotEmpty @Email String email,
        @NotEmpty String name,
        @NotEmpty String phone,
        @NotEmpty String designation,
        @NotEmpty String location,
        @NotEmpty MultipartFile banner) {

}
