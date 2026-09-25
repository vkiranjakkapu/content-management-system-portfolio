package com.cms.maintenance.services;

import java.io.IOException;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.dto.CreateProfileRequestDto;
import com.cms.maintenance.dto.UpdateProfileRequestDto;
import com.cms.maintenance.models.Profile;

public interface ProfileService {

    Profile getCurrentUserProfile();
    
    Profile getProfileById(UUID profileId);

    Profile getProfileByUserId(UUID userId);

    Profile createProfile(CreateProfileRequestDto request) throws IOException;

    Profile updateProfile(Profile profile);

    Profile updateProfile(UpdateProfileRequestDto request);

    Profile updateProfileImage(MultipartFile file);

    boolean deleteProfileById(UUID id);
    
}