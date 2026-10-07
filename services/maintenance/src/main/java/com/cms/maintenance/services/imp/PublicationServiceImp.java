package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cms.maintenance.dto.PublicationResponseDto;
import com.cms.maintenance.dto.UpdatePublicationRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.enums.PublicationStatus;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.DisplaySettings;
import com.cms.maintenance.models.Publication;
import com.cms.maintenance.models.SeoSettings;
import com.cms.maintenance.repositories.PublicationsRepository;
import com.cms.maintenance.services.AboutService;
import com.cms.maintenance.services.ExperienceService;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.ProjectService;
import com.cms.maintenance.services.PublicationService;
import com.cms.maintenance.services.SkillsService;
import com.cms.maintenance.services.SocialProfileService;

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
    private final SocialProfileService socialProfileService;

    @Override
    public List<Publication> getAllPublications() {
        return publicationsRepository.findAllByProfileOrderByUpdatedAtDesc(profileService.getCurrentUserProfile());
    }

    @Override
    public Publication getLatestPublicPublication() {
        return publicationsRepository.findFirstByStatusOrderByUpdatedAtDesc(PublicationStatus.PUBLISH)
                .orElseThrow(() -> new BusinessException(BusinessExceptions.PUBLICATION_NOT_FOUND,
                        "No active publication found.", HttpStatus.NOT_FOUND));
    }

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
    @Transactional
    public Publication publishById(UUID id) {

        Publication newPublication = getPublicationById(id);

        publicationsRepository
                .findByProfileAndStatus(profileService.getCurrentUserProfile(), PublicationStatus.PUBLISH)
                .ifPresent(oldPublication -> {
                    oldPublication.setStatus(PublicationStatus.UN_PUBLISH);
                    publicationsRepository.save(oldPublication);
                });

        newPublication.setStatus(PublicationStatus.PUBLISH);
        return publicationsRepository.save(newPublication);
    }

    @Override
    public Publication updatePublication(UpdatePublicationRequestDto request) {

        Publication draft = Optional.ofNullable(request.publicationId()).map(pbId -> getPublicationById(pbId))
                .orElse(getDraftPublication());

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

        Optional.ofNullable(request.seo()).ifPresent(seoRequest -> {

            if (draft.getSeo() == null) {
                SeoSettings seo = SeoSettings.builder().build();
                seo.setPublication(draft);
                draft.setSeo(seo);
            }

            SeoSettings seo = draft.getSeo();

            Optional.ofNullable(seoRequest.title())
                    .ifPresent(seo::setTitle);

            Optional.ofNullable(seoRequest.description())
                    .ifPresent(seo::setDescription);

            Optional.ofNullable(seoRequest.canonicalUrl())
                    .ifPresent(seo::setCanonicalUrl);

            Optional.ofNullable(seoRequest.ogTitle())
                    .ifPresent(seo::setOgTitle);

            Optional.ofNullable(seoRequest.ogDescription())
                    .ifPresent(seo::setOgDescription);

            Optional.ofNullable(seoRequest.ogImageId())
                    .ifPresent(seo::setOgImageId);

            Optional.ofNullable(seoRequest.robots())
                    .ifPresent(seo::setRobots);
        });

        return publicationsRepository.save(draft);
    }

    private Publication getDraftPublication() {
        return publicationsRepository
                .findFirstByProfileAndStatusOrderByCreatedAtDesc(profileService.getCurrentUserProfile(),
                        PublicationStatus.DRAFT)
                .orElseGet(() -> {
                    SeoSettings seo = SeoSettings.builder().build();
                    DisplaySettings settings = DisplaySettings.builder().build();

                    Publication publication = Publication.builder().build();
                    publication.setSettings(settings);
                    publication.setSeo(seo);
                    publication.setProfile(profileService.getCurrentUserProfile());

                    settings.setPublication(publication);
                    seo.setPublication(publication);

                    return publicationsRepository.save(publication);
                });
    }

    @Override
    public PublicationResponseDto mapToResponse(Publication publication) {
        return PublicationResponseDto.builder()
                .profile(profileService.mapToResponse(publication.getProfile()))
                .settings(publication.getSettings())
                .seo(publication.getSeo())
                .about(publication.getAbout())
                .skills(skillsService.mapToResponse(publication.getSkills()))
                .projects(publication.getProjects().stream().map(prj -> projectService.mapToResponse(prj)).toList())
                .experiences(publication.getExperiences())
                .socialProfiles(publication.getSocialProfiles().stream()
                        .map(sp -> socialProfileService.mapToResponse(sp)).toList())
                .build();
    }

}
