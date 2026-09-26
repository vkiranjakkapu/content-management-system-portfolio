package com.cms.maintenance.services;

import java.util.UUID;

import com.cms.maintenance.dto.CreateProfileRequestDto;
import com.cms.maintenance.dto.ProfileResponseDto;
import com.cms.maintenance.dto.UpdateProfileRequestDto;
import com.cms.maintenance.models.Profile;

public interface ProfileService {

    Profile getCurrentUserProfile();

    Profile getProfileById(UUID profileId);

    Profile getProfileByUserId(UUID userId);

    Profile createProfile(CreateProfileRequestDto request);

    Profile updateProfile(Profile profile);

    Profile updateProfile(UpdateProfileRequestDto request);

    void deleteProfileById(UUID id);

    ProfileResponseDto mapToResponse(Profile profile);

}