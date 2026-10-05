package com.cms.maintenance.dto;

import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.enums.MediaTag;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateMediaRequestDto(
        @NotNull(message = "Please select a file") MultipartFile file,
        @NotNull(message = "Media tag is required") MediaTag tag) {

}
