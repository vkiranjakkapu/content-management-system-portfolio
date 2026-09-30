package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.SocialProfileDto;
import com.cms.maintenance.dto.UpdateSocialProfileDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.SocialProfile;
import com.cms.maintenance.repositories.SocialProfileRepository;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.SocialProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SocialProfileServiceImp implements SocialProfileService {

    private final SocialProfileRepository socialRepository;
    private final ProfileService profileService;

    @Override
    public List<SocialProfileDto> getAllMySocialProfiles() {
        return socialRepository.findByProfile(profileService.getCurrentUserProfile());
    }

    @Override
    public SocialProfile getSocialProfileById(UUID id) {
        return socialRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "No social profile found with given ID."));
    }

    @Override
    public SocialProfile createSocialProfile(SocialProfileDto request) {
        return socialRepository.save(SocialProfile.builder().name(request.name()).url(request.url())
                .profile(profileService.getCurrentUserProfile()).build());
    }

    @Override
    public SocialProfile updateSocialProfile(UpdateSocialProfileDto request) {
        SocialProfile socialProfile = getSocialProfileById(request.id());
        socialProfile.setName(request.name());
        socialProfile.setUrl(request.url());
        return socialRepository.save(socialProfile);
    }

    @Override
    public void deleteSocialProfile(UUID id) {
        socialRepository.deleteById(id);
    }

    @Override
    public SocialProfileDto mapToResponse(SocialProfile socialProfile) {
        return SocialProfileDto.builder().name(socialProfile.getName()).url(socialProfile.getUrl()).build();
    }

}
