package com.cms.maintenance.dto;

import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.enums.MediaTag;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;

@Builder
public record CreateMediaRequestDto(
        @NotEmpty MultipartFile file,
        @NotEmpty MediaTag tag) {

}
