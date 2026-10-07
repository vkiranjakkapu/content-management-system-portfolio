package com.cms.maintenance.services.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.cms.maintenance.enums.PublicationStatus;
import com.cms.maintenance.models.Publication;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.repositories.PublicationsRepository;
import com.cms.maintenance.services.AboutService;
import com.cms.maintenance.services.ExperienceService;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.ProjectService;
import com.cms.maintenance.services.SkillsService;
import com.cms.maintenance.services.SocialProfileService;

@ExtendWith(MockitoExtension.class)
class PublicationServiceImpTest {

    @Mock
    private PublicationsRepository publicationsRepository;

    @Mock
    private ProfileService profileService;

    @Mock
    private AboutService aboutService;

    @Mock
    private SkillsService skillsService;

    @Mock
    private ProjectService projectService;

    @Mock
    private ExperienceService experienceService;

    @Mock
    private SocialProfileService socialProfileService;

    @InjectMocks
    private PublicationServiceImp publicationService;

    @Test
    void shouldFindLatestPublicPublicationWithoutCurrentUserProfile() {
        Publication publication = new Publication();
        when(publicationsRepository.findFirstByStatusOrderByUpdatedAtDesc(PublicationStatus.PUBLISH))
                .thenReturn(Optional.of(publication));

        Publication result = publicationService.getLatestPublicPublication();

        assertThat(result).isSameAs(publication);
        verify(publicationsRepository).findFirstByStatusOrderByUpdatedAtDesc(PublicationStatus.PUBLISH);
        verifyNoInteractions(profileService);
    }
    @Test
    void shouldPublishFirstPublicationWhenNoPublicationIsCurrentlyPublished() {
        Profile profile = new Profile();
        Publication draft = new Publication();
        when(profileService.getCurrentUserProfile()).thenReturn(profile);
        when(publicationsRepository.findById(draft.getId())).thenReturn(Optional.of(draft));
        when(publicationsRepository.findByProfileAndStatus(profile, PublicationStatus.PUBLISH))
                .thenReturn(Optional.empty());
        when(publicationsRepository.save(draft)).thenReturn(draft);

        Publication result = publicationService.publishById(draft.getId());

        assertThat(result).isSameAs(draft);
        assertThat(result.getStatus()).isEqualTo(PublicationStatus.PUBLISH);
        verify(publicationsRepository).save(draft);
    }

    @Test
    void shouldUnpublishCurrentPublicationBeforePublishingNewDraft() {
        Profile profile = new Profile();
        Publication oldPublication = new Publication();
        oldPublication.setStatus(PublicationStatus.PUBLISH);
        Publication newPublication = new Publication();
        newPublication.setStatus(PublicationStatus.DRAFT);

        when(profileService.getCurrentUserProfile()).thenReturn(profile);
        when(publicationsRepository.findById(newPublication.getId())).thenReturn(Optional.of(newPublication));
        when(publicationsRepository.findByProfileAndStatus(profile, PublicationStatus.PUBLISH))
                .thenReturn(Optional.of(oldPublication));
        when(publicationsRepository.save(oldPublication)).thenReturn(oldPublication);
        when(publicationsRepository.save(newPublication)).thenReturn(newPublication);

        Publication result = publicationService.publishById(newPublication.getId());

        assertThat(oldPublication.getStatus()).isEqualTo(PublicationStatus.UN_PUBLISH);
        assertThat(result.getStatus()).isEqualTo(PublicationStatus.PUBLISH);
        verify(publicationsRepository).save(oldPublication);
        verify(publicationsRepository).save(newPublication);
    }

}