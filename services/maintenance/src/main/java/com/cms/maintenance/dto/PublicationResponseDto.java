package com.cms.maintenance.dto;

import java.util.List;
import java.util.Map;

import com.cms.maintenance.enums.PublicationStatus;
import com.cms.maintenance.models.About;
import com.cms.maintenance.models.DisplaySettings;
import com.cms.maintenance.models.Experience;
import com.cms.maintenance.models.SeoSettings;
import com.cms.maintenance.models.Skill;

import lombok.Builder;

@Builder
public record PublicationResponseDto(
        ProfileResponseDto profile,
        DisplaySettings settings,
        SeoSettings seo,
        About about,
        Map<String,List<Skill>> skills,
        List<ProjectResponseDto> projects,
        List<Experience> experiences,
        List<SocialProfileDto> socialProfiles,
        PublicationStatus status) {

}
