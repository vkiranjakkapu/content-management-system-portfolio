package com.cms.maintenance.services.imp;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreateMediaRequestDto;
import com.cms.maintenance.dto.CreateProfileRequestDto;
import com.cms.maintenance.dto.ProfileResponseDto;
import com.cms.maintenance.dto.UpdateProfileRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.enums.MediaTag;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.repositories.ProfileRepository;
import com.cms.maintenance.services.CurrentUserService;
import com.cms.maintenance.services.MediaService;
import com.cms.maintenance.services.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImp implements ProfileService {

    private final ProfileRepository profileRepository;
    private final CurrentUserService currentUser;
    private final MediaService mediaService;

    @Override
    public Profile getCurrentUserProfile() {
        return profileRepository.findByUserId(currentUser.userId()).orElseThrow(
                () -> new BusinessException(BusinessExceptions.PROFILE_NOT_FOUND,
                        "No Profile associated with this user. Create one to proceed.", HttpStatus.TOO_EARLY));
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
    public Profile createProfile(CreateProfileRequestDto request) {

        boolean profileExists = profileRepository.findByUserId(currentUser.userId()).isPresent();

        if (profileExists) {
            throw new BusinessException(BusinessExceptions.PROFILE_ALREADY_EXISTS,
                    "Profile already exists for this user.");
        }

        Profile profile = Profile.builder()
                .userId(currentUser.userId())
                .email(request.email())
                .name(request.name())
                .phone(request.phone())
                .designation(request.designation())
                .location(request.location())
                .availability(request.availability())
                .build();

        Profile savedProfile = profileRepository.save(profile);

        Optional.ofNullable(request.dp()).ifPresent(dpReq -> {
            Media dp = mediaService.createMedia(CreateMediaRequestDto.builder()
                    .file(request.dp())
                    .tag(MediaTag.PROFILE)
                    .build(), savedProfile);
            savedProfile.setDp(dp);
        });

        Optional.ofNullable(request.banner()).ifPresent(bannerReq -> {
            Media banner = mediaService.createMedia(CreateMediaRequestDto.builder()
                    .file(request.banner())
                    .tag(MediaTag.BANNER)
                    .build(), savedProfile);
            savedProfile.setBanner(banner);
        });

        return profileRepository.save(savedProfile);
    }

    @Override
    public Profile updateProfile(UpdateProfileRequestDto request) {
        Profile profile = getProfileByUserId(currentUser.userId());

        Optional.ofNullable(request.email()).ifPresent(profile::setEmail);

        Optional.ofNullable(request.name()).ifPresent(profile::setName);

        Optional.ofNullable(request.phone()).ifPresent(profile::setPhone);

        Optional.ofNullable(request.designation()).ifPresent(profile::setDesignation);

        Optional.ofNullable(request.availability()).ifPresent(profile::setAvailability);

        Optional.ofNullable(request.location()).ifPresent(profile::setLocation);

        Optional.ofNullable(request.dp()).ifPresent(dpReq -> {
            try {
                mediaService.deleteMediaById(profile.getDp().getId());
            } catch (BusinessException e) {
                e.printStackTrace();
            }

            Media dp = mediaService.createMedia(CreateMediaRequestDto.builder()
                    .file(dpReq)
                    .tag(MediaTag.PROFILE)
                    .build(), getCurrentUserProfile());
            dp.setProfile(profile);
            profile.setDp(dp);
        });

        Optional.ofNullable(request.banner()).ifPresent(bannerReq -> {
            try {
                mediaService.deleteMediaById(profile.getBanner().getId());
            } catch (BusinessException e) {
                e.printStackTrace();
            }

            Media banner = mediaService.createMedia(CreateMediaRequestDto.builder()
                    .file(bannerReq)
                    .tag(MediaTag.BANNER)
                    .build(), getCurrentUserProfile());
            banner.setProfile(profile);
            profile.setBanner(banner);
        });

        return profileRepository.save(profile);
    }

    @Override
    public void deleteProfileById(UUID id) {
        profileRepository.deleteById(id);
    }

    @Override
    public ProfileResponseDto mapToResponse(Profile profile) {
        return ProfileResponseDto.builder()
                .id(profile.getId())
                .name(profile.getName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .designation(profile.getDesignation())
                .availability(profile.getAvailability())
                .dp(mediaService.mapToResponse(profile.getDp(), false))
                .banner(mediaService.mapToResponse(profile.getBanner(), false))
                .build();
    }

}
