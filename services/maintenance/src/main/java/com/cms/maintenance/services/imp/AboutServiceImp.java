package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreateAboutRequestDto;
import com.cms.maintenance.dto.UpdateAboutRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.About;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.repositories.AboutRepository;
import com.cms.maintenance.services.AboutService;
import com.cms.maintenance.services.CurrentUserService;
import com.cms.maintenance.services.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AboutServiceImp implements AboutService {

    private final AboutRepository aboutRepository;
    private final ProfileService profileService;
    private final CurrentUserService currentUser;

    @Override
    public List<About> getAllAbouts() {
        return aboutRepository.findAllByProfile(profileService.getCurrentUserProfile());
    }

    @Override
    public About getLatestAboutByProfileId(UUID profileId) {
        return aboutRepository.findByProfileAndIsActiveTrue(Profile.builder().id(profileId).build())
                .orElseThrow(() -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "No active About details found for profile."));
    }

    @Override
    public About getAboutById(UUID id) {
        return aboutRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "About details with givenId was not found."));
    }

    @Override
    public About createAbout(CreateAboutRequestDto request) {
        Profile profile = profileService.getProfileByUserId(currentUser.userId());

        About activeAbout = getLatestAboutByProfileId(profile.getId());
        activeAbout.setActive(false);

        About about = About.builder()
                .profile(profile)
                .name(request.name())
                .summary(request.summary())
                .build();
        aboutRepository.saveAll(List.of(about, activeAbout));

        return about;
    }

    @Override
    public About updateAbout(UpdateAboutRequestDto request) {
        About about = getAboutById(request.aboutId());
        about.setSummary(request.summary());
        about.setName(request.name());

        return aboutRepository.save(about);
    }

    @Override
    public boolean deleteAboutById(UUID id) {
        aboutRepository.deleteById(id);
        return true;
    }

}
