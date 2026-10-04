package com.cms.maintenance.dto;

import java.util.UUID;

import com.cms.maintenance.enums.MediaTag;

import jakarta.validation.constraints.NotNull;

public record UpdateMediaRequestDto(
		@NotNull UUID id,
		@NotNull MediaTag tag) {

}
