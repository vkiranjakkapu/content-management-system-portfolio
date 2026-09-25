package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record CreateProjectRequestDto(
        @NotEmpty String title,
        @NotEmpty List<UUID> techStack,
        @NotEmpty List<UUID> gallery,
        @NotEmpty String gitUrl) {

}
