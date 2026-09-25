package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.CreateExperienceRequestDto;
import com.cms.maintenance.dto.UpdateExperienceRequestDto;
import com.cms.maintenance.models.Experience;

public interface ExperienceService {

    Experience getLatestExperienceByProfileId(UUID profileId);

    Experience getExperienceById(UUID id);

    List<Experience> getAllExperiencesByIdsIn(List<UUID> ids);

    Experience createExperience(CreateExperienceRequestDto request);

    Experience updateExperience(UpdateExperienceRequestDto request);

    boolean deleteExperience(UUID id);

}