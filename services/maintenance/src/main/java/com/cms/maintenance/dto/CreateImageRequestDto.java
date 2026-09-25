package com.cms.maintenance.dto;

import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.enums.ImageTag;

import jakarta.validation.constraints.NotEmpty;

public record CreateImageRequestDto(
        @NotEmpty MultipartFile file,
        @NotEmpty ImageTag tag) {

}
