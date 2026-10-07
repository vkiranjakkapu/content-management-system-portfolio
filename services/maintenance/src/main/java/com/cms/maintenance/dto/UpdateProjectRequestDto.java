package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record UpdateProjectRequestDto(
		@NotNull UUID id,
		String title,
		String description,
		List<UUID> techStack,
		List<UUID> gallery,
		String gitUrl) {

}
