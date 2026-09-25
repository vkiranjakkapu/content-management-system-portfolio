package com.cms.maintenance.services.imp;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.dto.CreateProfileRequestDto;
import com.cms.maintenance.dto.UpdateProfileRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.repositories.ProfileRepository;
import com.cms.maintenance.services.CurrentUserService;
import com.cms.maintenance.services.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImp implements ProfileService {

    private final ProfileRepository profileRepository;
    private final CurrentUserService currentUser;

    @Override
    public Profile getCurrentUserProfile() {
        return profileRepository.findByUserId(currentUser.userId()).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "User doesn't created any profile so far."));
    }

    @Override
    public Profile getProfileById(UUID profileId) {
        return profileRepository.findById(profileId).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND, "Profile with given ID not found."));
    }

    @Override
    public Profile getProfileByUserId(UUID userId) {
        return profileRepository.findByUserId(userId).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "Profile with given userId not found."));
    }

    @Override
    public Profile createProfile(CreateProfileRequestDto request) throws IOException {
        return profileRepository.save(Profile.builder()
                .userId(currentUser.userId())
                .dp(request.dp().getBytes())
                .email(request.email())
                .name(request.name())
                .phone(request.phone())
                .dob(request.dob())
                .build());
    }

    @Override
    public Profile updateProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    @Override
    public Profile updateProfile(UpdateProfileRequestDto request) {
        Profile profile = getProfileByUserId(currentUser.userId());

        Optional.of(request.dp()).ifPresent(file -> {
            try {
                profile.setDp(file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                throw new BusinessException(BusinessExceptions.PROFILE_UPDATE_FAILED,
                        "Error while updating profile details.");
            }
        });

        profile.setEmail(request.email());
        profile.setName(request.name());
        profile.setPhone(request.phone());
        profile.setDob(request.dob());

        return profileRepository.save(profile);
    }

    @Override
    public Profile updateProfileImage(MultipartFile file) {
        Profile profile = getProfileByUserId(currentUser.userId());

        try {
            profile.setDp(file.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(BusinessExceptions.PROFILE_UPDATE_FAILED, "Error while Updating DP.");
        }

        return profileRepository.save(profile);
    }

    @Override
    public boolean deleteProfileById(UUID id) {
        profileRepository.deleteById(id);
        return true;
    }

}
