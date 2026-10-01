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
}