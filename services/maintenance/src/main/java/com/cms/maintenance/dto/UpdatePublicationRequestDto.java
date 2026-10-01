package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

public record UpdatePublicationRequestDto(
        UUID aboutId,
        List<UUID> skillIds,
        List<UUID> projectIds,
        List<UUID> experienceIds,
        boolean showSkills,
        boolean showProjects,
        boolean showExperience,
        boolean showContact,
        UpdateSeoSettingsRequestDto seo) {

}
