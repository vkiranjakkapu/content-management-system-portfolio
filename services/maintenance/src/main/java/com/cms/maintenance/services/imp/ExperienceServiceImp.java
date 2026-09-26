package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreateExperienceRequestDto;
import com.cms.maintenance.dto.UpdateExperienceRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Experience;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.repositories.ExperiencesRepository;
import com.cms.maintenance.services.ExperienceService;
import com.cms.maintenance.services.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExperienceServiceImp implements ExperienceService {

    private final ExperiencesRepository experiencesRepository;
    private final ProfileService profileService;

    @Override
    public List<Experience> getAllExperiences() {
        return experiencesRepository.findAllByProfile(profileService.getCurrentUserProfile());
    }

    @Override
    public Experience getLatestExperienceByProfileId(UUID profileId) {
        return experiencesRepository.findByProfileAndIsActiveTrue(Profile.builder().build())
                .orElseThrow(() -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "No active Experinece found for profile."));
    }

    @Override
    public Experience getExperienceById(UUID id) {
        return experiencesRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "Experience with given ID not found"));
    }

    @Override
    public List<Experience> getAllExperiencesByIds(List<UUID> ids) {
        return experiencesRepository.findAllByIdIn(ids);
    }

    @Override
    public Experience createExperience(CreateExperienceRequestDto request) {
        Profile profile = profileService.getCurrentUserProfile();

        Experience recentExperience = getLatestExperienceByProfileId(profile.getId());
        recentExperience.setActive(false);

        Experience experience = Experience.builder()
                .profile(profile)
                .company(request.company())
                .position(request.position())
                .startDate(request.startDate())
                .build();

        if (!request.isWorking()) {
            experience.setEndDate(request.ednDate());
        }

        experiencesRepository.saveAll(List.of(experience, recentExperience));
        return experience;
    }

    @Override
    public Experience updateExperience(UpdateExperienceRequestDto request) {
        Experience experience = getExperienceById(request.expId());
        experience.setCompany(request.company());
        experience.setPosition(request.position());
        experience.setStartDate(request.startDate());
        experience.setEndDate(request.ednDate());
        experience.setWorking(request.isWorking());

        return experiencesRepository.save(experience);
    }

    @Override
    public boolean deleteExperience(UUID id) {
        experiencesRepository.deleteById(id);
        return true;
    }

}
