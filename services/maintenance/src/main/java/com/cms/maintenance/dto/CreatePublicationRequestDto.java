package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record CreatePublicationRequestDto(
        @NotEmpty boolean showSkills,
        @NotEmpty boolean showProjects,
        @NotEmpty boolean showExperience,
        @NotEmpty boolean showContact,
        @NotEmpty UUID aboutId,
        @NotEmpty List<UUID> skills,
        @NotEmpty List<UUID> projects,
        @NotEmpty List<UUID> experiences) {

}
