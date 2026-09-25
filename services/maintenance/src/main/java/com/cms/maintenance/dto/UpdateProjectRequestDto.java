package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record UpdateProjectRequestDto(
		@NotEmpty UUID id,
		String title,
		List<UUID> techStack,
		List<UUID> gallery,
		String gitUrl) {

}
