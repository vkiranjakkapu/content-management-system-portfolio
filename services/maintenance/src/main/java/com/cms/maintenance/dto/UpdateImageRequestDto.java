package com.cms.maintenance.dto;

import java.util.UUID;

import com.cms.maintenance.enums.ImageTag;

import jakarta.validation.constraints.NotEmpty;

public record UpdateImageRequestDto(
		@NotEmpty UUID id,
		@NotEmpty ImageTag tag) {

}
