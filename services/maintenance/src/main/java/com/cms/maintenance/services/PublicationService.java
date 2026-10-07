package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.PublicationResponseDto;
import com.cms.maintenance.dto.UpdatePublicationRequestDto;
import com.cms.maintenance.models.Publication;

public interface PublicationService {

    List<Publication> getAllPublications();

    Publication getLatestPublicPublication();

    Publication getPublicationById(UUID id);

    Publication getLatestPublication();

    Publication updatePublication(UpdatePublicationRequestDto request);

    Publication publishById(UUID id);

    PublicationResponseDto mapToResponse(Publication publication);

}