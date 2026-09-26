package com.cms.maintenance.dto;

import java.util.UUID;

import com.cms.maintenance.enums.MediaTag;

import jakarta.validation.constraints.NotEmpty;

public record UpdateMediaRequestDto(
		@NotEmpty UUID id,
		@NotEmpty MediaTag tag) {

}
