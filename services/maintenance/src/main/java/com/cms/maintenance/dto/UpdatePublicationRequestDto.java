package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

public record UpdatePublicationRequestDto(
        UUID publicationId,
        UUID aboutId,
        List<UUID> skillIds,
        List<UUID> projectIds,
        List<UUID> experienceIds,
        Boolean showSkills,
        Boolean showProjects,
        Boolean showExperience,
        Boolean showContact,
        UpdateSeoSettingsRequestDto seo) {

}
