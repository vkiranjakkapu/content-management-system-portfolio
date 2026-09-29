package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.SocialProfileDto;
import com.cms.maintenance.dto.UpdateSocialProfileDto;
import com.cms.maintenance.models.SocialProfile;

public interface SocialProfileService {

    List<SocialProfileDto> getAllMySocialProfiles();

    SocialProfile getSocialProfileById(UUID id);

    SocialProfile createSocialProfile(SocialProfileDto request);

    SocialProfile updateSocialProfile(UpdateSocialProfileDto request);

    void deleteSocialProfile(UUID id);

    SocialProfileDto mapToResponse(SocialProfile socialProfile);

}