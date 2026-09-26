package com.cms.maintenance.services.imp;

import java.util.Optional;
import java.util.UUID;

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
    public Profile createProfile(CreateProfileRequestDto request) {
        Media dp = mediaService.createMedia(CreateMediaRequestDto.builder()
                .file(request.dp())
                .tag(MediaTag.PROFILE)
                .build());
        Media banner = mediaService.createMedia(CreateMediaRequestDto.builder()
                .file(request.banner())
                .tag(MediaTag.BANNER)
                .build());

        Profile profile = Profile.builder()
                .userId(currentUser.userId())
                .dp(dp)
                .email(request.email())
                .name(request.name())
                .phone(request.phone())
                .designation(request.designation())
                .location(request.location())
                .banner(banner)
                .build();

        dp.setProfile(profile);
        banner.setProfile(profile);

        return profileRepository.save(profile);
    }

    @Override
    public Profile updateProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    @Override
    public Profile updateProfile(UpdateProfileRequestDto request) {
        Profile profile = getProfileByUserId(currentUser.userId());

        Optional.of(request.email()).ifPresent(email -> {
            profile.setEmail(email);
        });

        Optional.of(request.name()).ifPresent(name -> {
            profile.setName(name);
        });

        Optional.of(request.phone()).ifPresent(phone -> {
            profile.setPhone(phone);
        });

        Optional.of(request.designation()).ifPresent(designation -> {
            profile.setDesignation(designation);
        });

        Optional.of(request.dp()).ifPresent(dpReq -> {
            try {
                mediaService.deleteMediaById(profile.getDp().getId());
            } catch (BusinessException e) {
                e.printStackTrace();
            }

            Media dp = mediaService.createMedia(CreateMediaRequestDto.builder()
                    .file(dpReq)
                    .tag(MediaTag.PROFILE)
                    .build());
            dp.setProfile(profile);
            profile.setDp(dp);
        });

        Optional.of(request.banner()).ifPresent(bannerReq -> {
            try {
                mediaService.deleteMediaById(profile.getBanner().getId());
            } catch (BusinessException e) {
                e.printStackTrace();
            }

            Media banner = mediaService.createMedia(CreateMediaRequestDto.builder()
                    .file(bannerReq)
                    .tag(MediaTag.BANNER)
                    .build());
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
                .dp(mediaService.mapToResponse(profile.getDp()))
                .build();
    }

}
