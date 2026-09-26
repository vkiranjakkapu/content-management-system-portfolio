package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record UpdatePublicationRequestDto(
        UUID aboutId,
        List<UUID> skillIds,
        List<UUID> projectIds,
        List<UUID> experienceIds,
        @NotEmpty boolean showSkills,
        @NotEmpty boolean showProjects,
        @NotEmpty boolean showExperience,
        @NotEmpty boolean showContact) {

}
