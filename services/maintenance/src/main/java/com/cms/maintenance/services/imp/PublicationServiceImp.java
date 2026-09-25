package com.cms.maintenance.services.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreatePublicationRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.DisplaySettings;
import com.cms.maintenance.models.Profile;
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
    public Publication getLatestPublication() {
        return publicationsRepository.findByProfileAndIsActiveTrue(profileService.getCurrentUserProfile()).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND, "No active publication found"));
    }

    @Override
    public Publication createPublication(CreatePublicationRequestDto request) {
        Profile profile = profileService.getCurrentUserProfile();

        Publication latestPublication = getLatestPublication();
        latestPublication.setActive(false);

        DisplaySettings settings = DisplaySettings.builder()
                .showSkills(request.showSkills())
                .showProjects(request.showProjects())
                .showExperience(request.showExperience())
                .showContact(request.showContact())
                .build();

        Publication publication = Publication.builder()
                .profile(profile)
                .settings(settings)
                .about(aboutService.getAboutById(request.aboutId()))
                .skills(skillsService.getAllSkillsByIds(request.skills()))
                .projects(projectService.getAllProjectsByIds(request.projects()))
                .experiences(experienceService.getAllExperiencesByIdsIn(request.experiences()))
                .build();

        publicationsRepository.saveAll(List.of(publication, latestPublication));

        return publication;
    }

}
