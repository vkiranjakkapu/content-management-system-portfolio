package com.cms.maintenance.services;

import com.cms.maintenance.dto.CreatePublicationRequestDto;
import com.cms.maintenance.models.Publication;

public interface PublicationService {

    Publication getLatestPublication();

    Publication createPublication(CreatePublicationRequestDto request);

}