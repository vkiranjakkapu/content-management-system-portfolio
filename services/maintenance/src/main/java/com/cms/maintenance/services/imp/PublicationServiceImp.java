package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.UpdatePublicationRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.enums.PublicationStatus;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.DisplaySettings;
import com.cms.maintenance.models.Publication;
import com.cms.maintenance.repositories.PublicationsRepository;
import com.cms.maintenance.services.AboutService;
import com.cms.maintenance.services.ExperienceService;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.ProjectService;
import com.cms.maintenance.services.PublicationService;
import com.cms.maintenance.services.SkillsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PublicationServiceImp implements PublicationService {

    private final PublicationsRepository publicationsRepository;
    private final ProfileService profileService;
    private final AboutService aboutService;
    private final SkillsService skillsService;
    private final ProjectService projectService;
    private final ExperienceService experienceService;

    @Override
    public Publication getPublicationById(UUID id) {
        return publicationsRepository
                .findById(id).orElseThrow(
                        () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                                "No publication found with given Id."));
    }

    @Override
    public Publication getLatestPublication() {
        return publicationsRepository
                .findByProfileAndStatus(profileService.getCurrentUserProfile(), PublicationStatus.PUBLISH).orElseThrow(
                        () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                                "No active publication found."));
    }

    @Override
    public Publication publishById(UUID id) {

        Publication oldPublication = getLatestPublication();
        oldPublication.setStatus(PublicationStatus.UN_PUBLISH);

        Publication newPublication = getPublicationById(id);
        newPublication.setStatus(PublicationStatus.PUBLISH);

        publicationsRepository.saveAll(List.of(newPublication, oldPublication));

        return newPublication;
    }

    @Override
    public Publication updatePublication(UpdatePublicationRequestDto request) {

        Publication draft = getDraftPublication();

        Optional.ofNullable(request.aboutId()).ifPresent(aboutId -> {
            draft.setAbout(aboutService.getAboutById(aboutId));
        });

        Optional.ofNullable(request.skillIds()).ifPresent(skillIds -> {
            draft.setSkills(skillsService.getAllSkillsByIds(skillIds));
        });

        Optional.ofNullable(request.projectIds()).ifPresent(projectIds -> {
            draft.setProjects(projectService.getAllProjectsByIds(projectIds));
        });

        Optional.ofNullable(request.experienceIds()).ifPresent(expIds -> {
            draft.setExperiences(experienceService.getAllExperiencesByIds(expIds));
        });

        Optional.ofNullable(request.showSkills()).ifPresent(showSkills -> {
            draft.getSettings().setShowSkills(showSkills);
        });

        Optional.ofNullable(request.showProjects()).ifPresent(showProjects -> {
            draft.getSettings().setShowProjects(showProjects);
        });

        Optional.ofNullable(request.showExperience()).ifPresent(showExperience -> {
            draft.getSettings().setShowExperience(showExperience);
        });

        Optional.ofNullable(request.showContact()).ifPresent(showContact -> {
            draft.getSettings().setShowContact(showContact);
        });

        return publicationsRepository.save(draft);
    }

    private Publication getDraftPublication() {
        return publicationsRepository.findFirstByProfileAndStatus(profileService.getCurrentUserProfile(),
                PublicationStatus.DRAFT).orElseGet(() -> {
                    DisplaySettings settings = DisplaySettings.builder().build();

                    Publication publication = Publication.builder().build();
                    publication.setSettings(settings);
                    publication.setProfile(profileService.getCurrentUserProfile());

                    settings.setPublication(publication);

                    return publicationsRepository.save(publication);
                });
    }

}
